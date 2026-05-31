import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Point } from '../../../../models/point.model';

export function generateRoad(
  width: number,
  from: Point,
  to: Point,
  customName?: string,
) {
  const xSize = Math.abs(to.x - from.x);
  const zSize = Math.abs(to.y - from.y);

  const geometry = new THREE.PlaneGeometry(xSize + width, zSize + width);
  const material = new THREE.MeshStandardMaterial({
    color: 0x505050,
    roughness: 0.6,
    metalness: 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = Math.min(from.x, to.x) + xSize / 2;
  mesh.position.z = Math.min(from.y, to.y) + zSize / 2;
  mesh.rotation.x = degToRad(-90);
  mesh.name = customName ?? 'Road';
  return mesh;
}
