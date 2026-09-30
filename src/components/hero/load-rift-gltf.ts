import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Loads the rift model from a gzipped GLB (scripts/optimize-rift-glb.mjs writes both).
 *
 * CDNs only compress an allowlist of MIME types and model/gltf-binary isn't on
 * Vercel's, so a plain .glb would go over the wire at full size (944 KB). The .gz
 * is 408 KB and inflates in the browser with DecompressionStream. Browsers without
 * it (Safari < 16.4) fetch the plain .glb instead.
 */
export async function loadRiftGltf(url: string): Promise<GLTF> {
	const gzipped = typeof DecompressionStream !== "undefined";
	const response = await fetch(gzipped ? `${url}.gz` : url);
	if (!response.ok) throw new Error(`Rift model: HTTP ${response.status}`);
	let bytes = new Uint8Array(await response.arrayBuffer());
	// Only inflate if the bytes are still gzip: a server may already have decoded
	// the file by sending it with Content-Encoding: gzip.
	if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
		const stream = new Blob([bytes])
			.stream()
			.pipeThrough(new DecompressionStream("gzip"));
		bytes = new Uint8Array(await new Response(stream).arrayBuffer());
	}
	return new GLTFLoader()
		.setMeshoptDecoder(MeshoptDecoder)
		.parseAsync(bytes.buffer, "");
}
