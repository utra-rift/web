import * as THREE from 'three';

// Curve shape keys do not survive Blender's curve-to-glTF conversion. Rebuild
// the authored polyline tubes and apply the sampled shape-key weights instead.
export function createAnimatedTube(data) {
  const count = data.points.length;
  const segments = data.radialSegments;
  const stride = segments + 1;
  const positions = new Float32Array(count * stride * 3);
  const uv = new Float32Array(count * stride * 2);
  const indices = [];
  for (let i = 0; i < count; i++) {
    for (let j = 0; j <= segments; j++) {
      const index = i * stride + j;
      uv[index * 2] = i / (count - 1);
      uv[index * 2 + 1] = j / segments;
      if (i < count - 1 && j < segments) {
        indices.push(index, index + stride, index + 1, index + 1, index + stride, index + stride + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', attribute);
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  const points = data.points.map(() => new THREE.Vector3());
  const tangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const reference = new THREE.Vector3();

  return {
    geometry,
    update(first, second, fraction) {
      const weights = data.shapes.map((shape) => THREE.MathUtils.lerp(shape.weights[first], shape.weights[second], fraction));
      for (let i = 0; i < count; i++) {
        points[i].fromArray(data.points[i]);
        for (let s = 0; s < data.shapes.length; s++) {
          const delta = data.shapes[s].delta[i];
          points[i].x += delta[0] * weights[s];
          points[i].y += delta[1] * weights[s];
          points[i].z += delta[2] * weights[s];
        }
      }
      for (let i = 0; i < count; i++) {
        tangent.subVectors(points[Math.min(i + 1, count - 1)], points[Math.max(i - 1, 0)]);
        if (tangent.lengthSq() < 1e-12) tangent.set(1, 0, 0);
        tangent.normalize();
        reference.set(0, 1, 0);
        if (Math.abs(tangent.y) > 0.9) reference.set(1, 0, 0);
        normal.crossVectors(tangent, reference).normalize();
        binormal.crossVectors(tangent, normal).normalize();
        const radius = data.bevelDepth * data.radii[i];
        for (let j = 0; j <= segments; j++) {
          const angle = j / segments * Math.PI * 2;
          const a = Math.cos(angle) * radius;
          const b = Math.sin(angle) * radius;
          const index = (i * stride + j) * 3;
          positions[index] = points[i].x + normal.x * a + binormal.x * b;
          positions[index + 1] = points[i].y + normal.y * a + binormal.y * b;
          positions[index + 2] = points[i].z + normal.z * a + binormal.z * b;
        }
      }
      attribute.needsUpdate = true;
    },
  };
}
