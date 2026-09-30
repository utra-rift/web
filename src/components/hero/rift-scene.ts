/*
 * Real-time WebGL rift from https://github.com/RunTheBot/threejs-rift
 * (Three.js rendering of Rift_Opening_Singularity_ApertureMasked.blend).
 *
 * The repo's loader and shaders are vendored in ./threejs-rift/ with minimal
 * patches (asset paths, meshopt decoder), so updates can be dropped in. This
 * module adds what the hero needs around them: a fixed front camera framed like
 * the approved video, a pixel budget, and a final pass that reproduces
 * render/post.py from the design handoff (the rift rendered with alpha, bloomed,
 * then composited over the navy vignette).
 *
 * Assets live in public/rift/. rift.glb is compressed by
 * scripts/optimize-rift-glb.mjs (6.1 MB -> 1.4 MB); the JSON files are the repo's.
 */
import {
	HalfFloatType,
	type Mesh,
	PerspectiveCamera,
	Scene,
	type ShaderMaterial,
	type Texture,
	Vector2,
	Vector3,
	WebGLRenderer,
	WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { loadRift } from "./threejs-rift/rift-shaders.js";

/** The Blender timeline: 260 frames at 30 fps. The opening plays once. */
export const RIFT_DURATION = 260 / 30;
/** After the opening, frames 106-260 loop; the opening controls are settled. */
export const RIFT_IDLE_START = 106 / 30;
/**
 * The approved video starts at Blender frame 36, so scene time = video time + 1.2 s.
 * All the hero's intro timings (letters at 2.2 s, UI at 2.9 s) are in video time.
 */
export const RIFT_VIDEO_OFFSET = 36 / 30;
/**
 * Where the live rift starts: frame 46. Nothing is visible before the first
 * ignition sparks at frame 47 (the tear itself starts at 50), so starting at the
 * video's frame 36 only added a third of a second of empty frames.
 */
export const RIFT_START = 46 / 30;

// ---------------------------------------------------------------------------
// Final composite: render/post.py from the design handoff, on the GPU.
// The scene arrives premultiplied (linear, HDR, bloom already added); it is
// soft-clipped, encoded to sRGB and laid over the same three-stop vignette.

const compositeShader = {
	uniforms: {
		tDiffuse: { value: null as Texture | null },
		uExposure: { value: 1 },
	},
	vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uExposure;
    varying vec2 vUv;

    vec3 background(vec2 uv) {
      // post.py: ellipse radii 0.6 W and 0.55 H; #0E1A2E -> #07101F at 0.6 -> #04070E at 1.0.
      vec2 d = (uv - 0.5) / vec2(0.6, 0.55);
      float r = length(d);
      vec3 c0 = vec3(14.0, 26.0, 46.0) / 255.0;
      vec3 c1 = vec3(7.0, 16.0, 31.0) / 255.0;
      vec3 c2 = vec3(4.0, 7.0, 14.0) / 255.0;
      return r < 0.6
        ? mix(c0, c1, clamp(r / 0.6, 0.0, 1.0))
        : mix(c1, c2, clamp((r - 0.6) / 0.4, 0.0, 1.0));
    }

    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }

    // Tiny ordered noise so the 8-bit output of the vignette doesn't band.
    float dither(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }

    void main() {
      vec4 s = texture2D(tDiffuse, vUv);
      float a = clamp(s.a, 0.0, 1.0);
      vec3 c = max(s.rgb * uExposure, 0.0);
      // post.py highlight roll-off: linear to 0.8, then eases into white.
      vec3 hi = max(c - 0.8, 0.0);
      c = min(c, 0.8) + 0.2 * (1.0 - exp(-hi / 0.2));
      vec3 outColor = background(vUv) * (1.0 - a) + toSRGB(clamp(c, 0.0, 1.0));
      outColor += dither(gl_FragCoord.xy) / 255.0;
      gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
    }
  `,
};

/** Frees the rift's GPU resources (the vendored loader has no dispose). */
function disposeRift(root: Scene) {
	const textures = new Set<Texture>();
	root.traverse((object) => {
		const mesh = object as Mesh;
		if (!mesh.isMesh) return;
		mesh.geometry.dispose();
		const material = mesh.material as ShaderMaterial;
		for (const uniform of Object.values(material.uniforms ?? {})) {
			if ((uniform.value as Texture | null)?.isTexture)
				textures.add(uniform.value);
		}
		material.dispose();
	});
	for (const texture of textures) texture.dispose();
}

// ---------------------------------------------------------------------------
// Hero renderer.

/** Camera framing matched to the approved video (see README). */
const CAMERA = { fov: 45, distance: 115, zoom: 0.78, offsetY: 0 };
/**
 * Post-processing (bloom, exposure before the post.py roll-off) and the playback
 * rate of the settled loop. The opening always plays in real time so the intro
 * stays in sync; after it, idleSpeed slows the discharge flashes, shader pulses
 * and flying crackles, which shimmer too fast at 1x.
 */
const LOOK = {
	bloomStrength: 0.3,
	bloomRadius: 0.2,
	bloomThreshold: 0.9,
	exposure: 1.6,
	idleSpeed: 0.4,
};
/** Cap on rendered pixels (width x height x DPR^2), to keep bloom cheap on big screens. */
const PIXEL_BUDGET = 3_200_000;

export type RiftRenderer = {
	/** Starts the loop, with the timeline at the given scene time (seconds). */
	start(sceneTime: number): void;
	/** Renders one frame at an exact scene time and stops the loop (for the still fallback / debugging). */
	renderAt(sceneTime: number): void;
	setVisible(visible: boolean): void;
	/** Adjusts the post-processing live (for matching the look against the video). */
	tune(params: Partial<typeof LOOK>): void;
	dispose(): void;
};

export async function createRiftRenderer(
	canvas: HTMLCanvasElement,
): Promise<RiftRenderer> {
	const renderer = new WebGLRenderer({
		canvas,
		antialias: false,
		alpha: false,
		powerPreference: "high-performance",
	});
	renderer.setClearColor(0x000000, 0);

	const camera = new PerspectiveCamera(CAMERA.fov, 16 / 10, 0.1, 500);
	camera.position.set(0, CAMERA.offsetY, CAMERA.distance);
	camera.lookAt(0, CAMERA.offsetY, 0);
	camera.zoom = CAMERA.zoom;
	camera.updateProjectionMatrix();

	const scene = new Scene();
	const rift = await loadRift(camera);
	scene.add(rift.scene);

	const target = new WebGLRenderTarget(1, 1, {
		type: HalfFloatType,
		samples: 4,
	});
	const composer = new EffectComposer(renderer, target);
	composer.addPass(new RenderPass(scene, camera));
	// Tight bloom on the brightest edges, tinted like post.py (0.55, 0.85, 1.0).
	const bloom = new UnrealBloomPass(
		new Vector2(1, 1),
		LOOK.bloomStrength,
		LOOK.bloomRadius,
		LOOK.bloomThreshold,
	);
	bloom.bloomTintColors = bloom.bloomTintColors.map(
		() => new Vector3(0.55, 0.85, 1.0),
	);
	composer.addPass(bloom);
	const composite = new ShaderPass(compositeShader);
	composite.uniforms.uExposure.value = LOOK.exposure;
	composer.addPass(composite);

	const resize = () => {
		const width = Math.max(1, canvas.clientWidth);
		const height = Math.max(1, canvas.clientHeight);
		const ratio = Math.min(
			window.devicePixelRatio || 1,
			1.5,
			Math.sqrt(PIXEL_BUDGET / (width * height)),
		);
		renderer.setPixelRatio(ratio);
		renderer.setSize(width, height, false);
		composer.setPixelRatio(ratio);
		composer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};
	const observer = new ResizeObserver(resize);
	observer.observe(canvas);
	resize();

	let frame = 0;
	let running = false;
	let visible = true;
	let sceneTime = 0;
	let previous = 0;
	let idleSpeed = LOOK.idleSpeed;

	const draw = (time: number) => {
		rift.update(time);
		composer.render();
	};

	const tick = (now: number) => {
		frame = 0;
		if (!running) return;
		const delta = Math.min((now - previous) / 1000, 0.1);
		previous = now;
		sceneTime += delta * (sceneTime >= RIFT_IDLE_START ? idleSpeed : 1);
		if (sceneTime >= RIFT_DURATION) {
			sceneTime =
				RIFT_IDLE_START +
				((sceneTime - RIFT_DURATION) % (RIFT_DURATION - RIFT_IDLE_START));
		}
		if (visible) draw(sceneTime);
		frame = requestAnimationFrame(tick);
	};

	return {
		start(time) {
			sceneTime = time;
			previous = performance.now();
			running = true;
			draw(sceneTime);
			if (!frame) frame = requestAnimationFrame(tick);
		},
		renderAt(time) {
			running = false;
			sceneTime = time;
			draw(time);
		},
		setVisible(value) {
			visible = value;
		},
		tune(params) {
			const look = { ...LOOK, ...params };
			bloom.strength = look.bloomStrength;
			bloom.radius = look.bloomRadius;
			bloom.threshold = look.bloomThreshold;
			composite.uniforms.uExposure.value = look.exposure;
			idleSpeed = look.idleSpeed;
			if (!running) draw(sceneTime);
		},
		dispose() {
			running = false;
			cancelAnimationFrame(frame);
			observer.disconnect();
			disposeRift(scene);
			bloom.dispose();
			composer.dispose();
			renderer.dispose();
		},
	};
}
