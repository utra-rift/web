// Vendored from https://github.com/RunTheBot/threejs-rift (commit 52eacbd).
// Local changes, kept minimal so updates can be dropped in:
//   1. Assets load from ASSET_BASE (public/rift/) instead of './'.
//   2. rift.glb loads through loadRiftGltf (gzipped + meshopt; see scripts/optimize-rift-glb.mjs).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadRiftGltf } from '../load-rift-gltf';
import { createAnimatedTube } from './rift-curves.js';

const ASSET_BASE = '/rift/';
const APERTURE_Y = -9.354106903076172;
const FRAME_DURATION = 260 / 30;

// Port of Blender's "OPENING | progressing electrical fracture" node group.
// The two animated Value nodes are sampled from the .blend into rift-opening.json.
const openingGLSL = /* glsl */`
  uniform float uOpeningProgress;
  uniform float uOpeningScale;

  float openingHash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float openingNoise(vec3 p) {
    vec3 cell = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = mix(openingHash(cell), openingHash(cell + vec3(1, 0, 0)), f.x);
    float b = mix(openingHash(cell + vec3(0, 1, 0)), openingHash(cell + vec3(1, 1, 0)), f.x);
    float c = mix(openingHash(cell + vec3(0, 0, 1)), openingHash(cell + vec3(1, 0, 1)), f.x);
    float d = mix(openingHash(cell + vec3(0, 1, 1)), openingHash(cell + vec3(1, 1, 1)), f.x);
    return mix(mix(a, b, f.y), mix(c, d, f.y), f.z);
  }

  float openingDistance(vec3 p) {
    // Blender Object coordinates: glTF converted source Y to local -Z.
    float radius = length(vec2(p.x * uOpeningScale, p.z * 0.86));
    float noise = 0.67 * openingNoise(p * 1.7)
                + 0.33 * openingNoise(p * 3.4);
    return radius + 0.7 * noise;
  }

  float openingOpacity(vec3 p) {
    return clamp((uOpeningProgress - openingDistance(p)) * 2.5 + 0.5, 0.0, 1.0);
  }

  float openingFrontGlow(vec3 p) {
    return clamp(1.0 - abs(uOpeningProgress - openingDistance(p)) * 2.0, 0.0, 1.0);
  }
`;

const energyVertex = /* glsl */`
  uniform mat4 uRiftFromObject;
  varying vec3 vLocal;
  varying vec3 vRift;
  varying float vCurveU;
  void main() {
    vLocal = position;
    vRift = (uRiftFromObject * vec4(position, 1.0)).xyz;
    vCurveU = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const energyFragment = /* glsl */`
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPhase;
  uniform float uKind;
  uniform float uCurveStart;
  uniform float uCurveEnd;
  uniform float uAnimatedEmission;
  varying vec3 vLocal;
  varying vec3 vRift;
  varying float vCurveU;
  ${openingGLSL}

  void main() {
    if (uKind > 3.5 && (vCurveU < uCurveStart || vCurveU > uCurveEnd)) discard;
    float reveal = uKind > 3.5 ? 1.0 : openingOpacity(vRift);
    float pulse = 0.65 + 0.35 * sin(uTime * (12.0 + uKind * 2.0) + uPhase + vLocal.x * 0.33);
    pulse *= 0.78 + 0.22 * sin(uTime * 27.0 + uPhase * 3.1 + vLocal.z * 0.47);
    pulse = mix(pulse, 1.0, uAnimatedEmission);
    float alpha = uOpacity * reveal * pulse;
    if (uKind < 0.5) alpha *= 0.7 + 0.3 * sin(uTime * 1.7 + vLocal.x * 0.07);
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uColor * uStrength * pulse, alpha);
  }
`;

const logoVertex = /* glsl */`
  uniform mat4 uRiftFromObject;
  attribute float _rift_edge;
  varying float vEdge;
  varying vec3 vLocal;
  varying vec3 vRift;
  void main() {
    vEdge = _rift_edge;
    vLocal = position;
    vRift = (uRiftFromObject * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const logoFragment = /* glsl */`
  uniform float uTime;
  varying float vEdge;
  varying vec3 vLocal;
  varying vec3 vRift;
  ${openingGLSL}
  void main() {
    float reveal = openingOpacity(vRift);
    float opacity = clamp(vEdge, 0.0, 1.0) * reveal;
    if (opacity < 0.005) discard;
    float front = openingFrontGlow(vRift) * reveal;
    gl_FragColor = vec4(vec3(0.0, 0.002, 0.008) + vec3(0.12, 0.5, 1.0) * front * 3.0, opacity);
  }
`;

const funnelVertex = /* glsl */`
  uniform mat4 uRiftFromObject;
  varying vec3 vLocal;
  varying vec3 vRift;
  void main() {
    vLocal = position;
    vRift = (uRiftFromObject * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The Blender node graph projects each view ray onto the exact aperture plane,
// looks up the packed silhouette, and hides cone fragments outside that gate.
const funnelFragment = /* glsl */`
  uniform sampler2D uAperture;
  uniform vec3 uCameraLocal;
  uniform float uTime;
  varying vec3 vLocal;
  varying vec3 vRift;
  ${openingGLSL}

  void main() {
    const float planeY = -9.354106903076172;
    if (uCameraLocal.y <= planeY + 0.0001) discard;
    float denom = vLocal.y - uCameraLocal.y;
    if (abs(denom) < 0.00001) discard;
    float rayT = (planeY - uCameraLocal.y) / denom;
    if (rayT < 0.0 || rayT > 1.0) discard;
    vec3 p = mix(uCameraLocal, vLocal, rayT);
    vec2 uv = vec2(
      (p.x + 7.641453266143799) / 15.467633247375488,
      (10.686360359191895 - p.z) / 19.685400009155273
    );
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    float gate = texture2D(uAperture, uv).r;
    if (gate < 0.5) discard;
    float mouth = clamp((vLocal.y + 31.354106903076172) / 22.24873161315918, 0.0, 1.0);
    float reveal = openingOpacity(vRift);
    vec3 deep = vec3(0.0, 0.0003, 0.001);
    vec3 lip = vec3(0.0, 0.005, 0.048);
    vec3 color = mix(deep, lip, pow(mouth, 3.0)) * reveal;
    gl_FragColor = vec4(color, reveal);
  }
`;

function phaseFromName(name) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295 * Math.PI * 2;
}

function energyMaterial(mesh, source, timeUniform, openingProgress, openingScale, originalName) {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const data = source[material?.name] || { color: [0.14, 0.52, 1.0], strength: 4.0 };
  const name = originalName;
  const corona = name.startsWith('Corona');
  const ejection = name.startsWith('Ejection');
  const seam = name.startsWith('Seam');
  const ignition = name.startsWith('Ignition');
  const opacity = corona ? (name.includes('soft') ? 0.10 : 0.20) : ejection ? 0.28 : seam ? 0.90 : ignition ? 0.85 : 0.22;
  return new THREE.ShaderMaterial({
    name: `Rift energy | ${material?.name || name}`,
    uniforms: {
      uColor: { value: new THREE.Vector3(...data.color) },
      uStrength: { value: data.strength },
      uOpacity: { value: opacity },
      uTime: timeUniform,
      uOpeningProgress: openingProgress,
      uOpeningScale: openingScale,
      uPhase: { value: phaseFromName(name) },
      uKind: { value: corona ? 0 : ejection ? 2 : seam ? 3 : ignition ? 4 : 1 },
      uCurveStart: { value: 0 },
      uCurveEnd: { value: 1 },
      uAnimatedEmission: { value: 0 },
      uRiftFromObject: { value: new THREE.Matrix4() },
    },
    vertexShader: energyVertex,
    fragmentShader: energyFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });
}

export async function loadRift(camera) {
  const [gltf, source, visibility, opening, emission, effectCurves, aperture] = await Promise.all([
    loadRiftGltf(ASSET_BASE + 'rift.glb'),
    fetch(ASSET_BASE + 'rift-materials.json').then((response) => {
      if (!response.ok) throw new Error(`Material data: HTTP ${response.status}`);
      return response.json();
    }),
    fetch(ASSET_BASE + 'rift-visibility.json').then((response) => {
      if (!response.ok) throw new Error(`Visibility data: HTTP ${response.status}`);
      return response.json();
    }),
    fetch(ASSET_BASE + 'rift-opening.json').then((response) => {
      if (!response.ok) throw new Error(`Opening data: HTTP ${response.status}`);
      return response.json();
    }),
    fetch(ASSET_BASE + 'rift-emission.json').then((response) => {
      if (!response.ok) throw new Error(`Emission data: HTTP ${response.status}`);
      return response.json();
    }),
    fetch(ASSET_BASE + 'rift-effect-curves.json').then((response) => {
      if (!response.ok) throw new Error(`Curve animation data: HTTP ${response.status}`);
      return response.json();
    }),
    new THREE.TextureLoader().loadAsync(ASSET_BASE + 'rift-aperture-mask.png'),
  ]);
  aperture.colorSpace = THREE.NoColorSpace;
  aperture.minFilter = THREE.LinearFilter;
  aperture.magFilter = THREE.LinearFilter;
  aperture.wrapS = THREE.ClampToEdgeWrapping;
  aperture.wrapT = THREE.ClampToEdgeWrapping;

  const timeUniform = { value: 186 / 30 };
  const openingProgress = { value: 80 };
  const openingScale = { value: 1 };
  const cameraLocal = { value: new THREE.Vector3() };
  const funnelMaterial = new THREE.ShaderMaterial({
    name: 'Rift aperture-masked singularity',
    uniforms: { uAperture: { value: aperture }, uCameraLocal: cameraLocal, uTime: timeUniform,
      uOpeningProgress: openingProgress, uOpeningScale: openingScale,
      uRiftFromObject: { value: new THREE.Matrix4() } },
    vertexShader: funnelVertex,
    fragmentShader: funnelFragment,
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
  const logoMaterial = new THREE.ShaderMaterial({
    name: 'Rift soft black field',
    uniforms: { uTime: timeUniform, uOpeningProgress: openingProgress, uOpeningScale: openingScale,
      uRiftFromObject: { value: new THREE.Matrix4() } },
    vertexShader: logoVertex,
    fragmentShader: logoFragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  let funnel = null;
  const animatedVisibility = [];
  const animatedEmissions = [];
  const animatedDraws = [];
  const animatedTubes = [];
  const riftCoordinates = [];
  const inverseRoot = new THREE.Matrix4();
  function sourceName(object) {
    const association = gltf.parser.associations.get(object);
    return association?.nodes !== undefined
      ? gltf.parser.json.nodes[association.nodes]?.name || object.name
      : object.name;
  }
  const root = gltf.scene.children.find((object) => sourceName(object) === 'RIFT CONTROL | position and opening');
  if (!root) throw new Error('Rift control was not found in rift.glb');
  root.position.set(0, 0, 0);
  gltf.scene.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const originalName = sourceName(mesh);
    if (visibility[originalName]) animatedVisibility.push([mesh, visibility[originalName]]);
    if (originalName === 'Void | tapered singularity funnel') {
      mesh.material = funnelMaterial;
      mesh.renderOrder = 1;
      funnel = mesh;
    } else if (originalName === 'Rift | traced logo folded into depth') {
      if (!mesh.geometry.getAttribute('_rift_edge')) throw new Error('Missing _rift_edge vertex attribute');
      mesh.material = logoMaterial;
      mesh.renderOrder = 2;
    } else {
      const materialName = Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name;
      mesh.material = energyMaterial(mesh, source, timeUniform, openingProgress, openingScale, originalName);
      if (emission[materialName]) {
        animatedEmissions.push([mesh.material.uniforms.uStrength, emission[materialName]]);
        mesh.material.uniforms.uAnimatedEmission.value = 1;
      }
      const curve = effectCurves[originalName];
      if (curve?.drawFrames) animatedDraws.push([mesh.material.uniforms, curve.drawFrames]);
      if (curve?.shapes) {
        const tube = createAnimatedTube(curve);
        mesh.geometry.dispose();
        mesh.geometry = tube.geometry;
        mesh.frustumCulled = false;
        animatedTubes.push(tube);
      }
      mesh.renderOrder = 3;
    }
    riftCoordinates.push([mesh, mesh.material.uniforms.uRiftFromObject.value]);
  });
  if (!funnel) throw new Error('Singularity funnel was not found in rift.glb');
  const mixer = new THREE.AnimationMixer(gltf.scene);
  for (const clip of gltf.animations) mixer.clipAction(clip).play();

  return {
    scene: gltf.scene,
    partCount: root.children.length,
    duration: FRAME_DURATION,
    update(time) {
      const t = ((time % FRAME_DURATION) + FRAME_DURATION) % FRAME_DURATION;
      timeUniform.value = t;
      mixer.setTime(t);
      const sample = Math.max(0, Math.min(opening.frames.length - 1, t * opening.fps - opening.startFrame));
      const first = Math.floor(sample);
      const second = Math.min(first + 1, opening.frames.length - 1);
      const fraction = sample - first;
      openingProgress.value = THREE.MathUtils.lerp(opening.frames[first][0], opening.frames[second][0], fraction);
      openingScale.value = THREE.MathUtils.lerp(opening.frames[first][1], opening.frames[second][1], fraction);
      for (const [uniform, values] of animatedEmissions) {
        uniform.value = THREE.MathUtils.lerp(values[first], values[second], fraction);
      }
      for (const [uniforms, values] of animatedDraws) {
        uniforms.uCurveStart.value = THREE.MathUtils.lerp(values[first][0], values[second][0], fraction);
        uniforms.uCurveEnd.value = THREE.MathUtils.lerp(values[first][1], values[second][1], fraction);
      }
      for (const tube of animatedTubes) tube.update(first, second, fraction);
      const frame = Math.max(1, Math.floor(t * 30 + 0.5));
      for (const [mesh, intervals] of animatedVisibility) {
        mesh.visible = intervals.some(([start, end]) => frame >= start && frame <= end);
      }
      gltf.scene.updateMatrixWorld(true);
      inverseRoot.copy(root.matrixWorld).invert();
      for (const [mesh, matrix] of riftCoordinates) matrix.multiplyMatrices(inverseRoot, mesh.matrixWorld);
      camera.getWorldPosition(cameraLocal.value);
      funnel.worldToLocal(cameraLocal.value);
    },
  };
}
