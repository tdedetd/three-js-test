import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Point } from '../../../../models/point.model';

export function generateRoad(
  width: number,
  from: Point,
  to: Point,
  customName?: string,
) {
  const xSize = Math.abs(to[0] - from[0]);
  const zSize = Math.abs(to[1] - from[1]);

  const geometry = new THREE.PlaneGeometry(xSize + width, zSize + width);
  const material = new THREE.MeshStandardMaterial({
    color: 0x505050,
    roughness: 0.6,
    metalness: 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = Math.min(from[0], to[0]) + xSize / 2;
  mesh.position.z = Math.min(from[1], to[1]) + zSize / 2;
  mesh.rotation.x = degToRad(-90);
  mesh.name = customName ?? 'Road';
  return mesh;
}
