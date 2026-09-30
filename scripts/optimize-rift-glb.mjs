// Shrinks the threejs-rift GLB for the web:
//   node scripts/optimize-rift-glb.mjs <rift.glb> <rift-effect-curves.json> <out.glb>
// Writes <out.glb> and a gzipped <out.glb>.gz. The hero loads the .gz and inflates it in
// the browser, because CDNs such as Vercel's don't compress .glb responses.
//
// - Strips normals and tangents (the rift's ShaderMaterials don't read them) and UVs,
//   except on the ignition strands, whose shader grows them along uv.x.
// - Replaces the geometry of the crawling arcs with a one-triangle placeholder:
//   rift-curves.js rebuilds those tubes from rift-effect-curves.json every frame.
//   The nodes, materials and names stay, because the loader finds them by name.
// - Snaps positions to a 1/256-unit grid (about 0.04 px on screen). They stay float32 in
//   each mesh's local space, which the shaders depend on, so glTF quantization is out;
//   the zeroed low bits are what make the file compress (908 KB -> 351 KB with brotli).
// - Applies EXT_meshopt_compression. Only accessors are deduplicated, so material names
//   survive.
import { readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { NodeIO, PropertyType } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import { dedup, prune, reorder, resample } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [input, curvesPath, output] = process.argv.slice(2);
if (!input || !curvesPath || !output) {
	throw new Error(
		"Usage: node scripts/optimize-rift-glb.mjs <rift.glb> <rift-effect-curves.json> <out.glb>",
	);
}

const POSITION_GRID = 256;

const curves = JSON.parse(await readFile(curvesPath, "utf8"));
const keepUV = new Set(Object.keys(curves).filter((name) => curves[name].drawFrames));
const rebuilt = new Set(Object.keys(curves).filter((name) => curves[name].shapes));

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO()
	.registerExtensions(ALL_EXTENSIONS)
	.registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

const doc = await io.read(input);
const buffer = doc.getRoot().listBuffers()[0];
for (const node of doc.getRoot().listNodes()) {
	const mesh = node.getMesh();
	if (!mesh) continue;
	const name = node.getName();
	for (const prim of mesh.listPrimitives()) {
		for (const semantic of ["NORMAL", "TANGENT"]) prim.setAttribute(semantic, null);
		if (!keepUV.has(name)) prim.setAttribute("TEXCOORD_0", null);
		for (const target of prim.listTargets()) {
			for (const semantic of ["NORMAL", "TANGENT"]) target.setAttribute(semantic, null);
		}
		if (rebuilt.has(name)) {
			for (const semantic of prim.listSemantics()) prim.setAttribute(semantic, null);
			for (const target of prim.listTargets()) prim.removeTarget(target);
			prim.setIndices(null);
			prim.setAttribute(
				"POSITION",
				doc.createAccessor().setType("VEC3").setArray(new Float32Array(9)).setBuffer(buffer),
			);
		}
	}
}
const snap = (accessor) => {
	if (!accessor) return;
	const array = accessor.getArray();
	for (let i = 0; i < array.length; i++) array[i] = Math.round(array[i] * POSITION_GRID) / POSITION_GRID;
};
for (const mesh of doc.getRoot().listMeshes()) {
	for (const prim of mesh.listPrimitives()) {
		snap(prim.getAttribute("POSITION"));
		for (const target of prim.listTargets()) snap(target.getAttribute("POSITION"));
	}
}

await doc.transform(
	dedup({ propertyTypes: [PropertyType.ACCESSOR] }),
	resample(),
	prune({ keepLeaves: true, keepAttributes: true, keepExtras: true }),
	reorder({ encoder: MeshoptEncoder }),
);
doc
	.createExtension(EXTMeshoptCompression)
	.setRequired(true)
	.setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
const glb = await io.writeBinary(doc);
await writeFile(output, glb);
await writeFile(`${output}.gz`, gzipSync(glb, { level: 9 }));
