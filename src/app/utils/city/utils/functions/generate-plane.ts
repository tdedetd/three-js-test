import * as THREE from 'three';
import { Point } from '../../../../models/point.model';
import { degToRad } from 'three/src/math/MathUtils.js';

export function generatePlane(
  from: Point,
  to: Point,
  customName?: string,
) {
  const xSize = Math.abs(to.x - from.x);
  const zSize = Math.abs(to.y - from.y);

  const geometry = new THREE.PlaneGeometry(xSize, zSize);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFF5555,
    roughness: 0.6,
    metalness: 0.1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = Math.min(from.x, to.x) + xSize / 2;
  mesh.position.z = Math.min(from.y, to.y) + zSize / 2;
  mesh.rotation.x = degToRad(-90);
  mesh.name = customName ?? 'Plane';
  return mesh;
}
