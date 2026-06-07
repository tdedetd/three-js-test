import * as THREE from 'three';
import { generatePlane } from './generate-plane';
import { degToRad } from 'three/src/math/MathUtils.js';

export function generateLandscape() {
  const plane = generatePlane(8000, 8000, new THREE.Color(0x540085));
  plane.name = 'Landscape';
  plane.rotation.x = degToRad(-90);
  plane.position.y = -2;
  return plane;
}
