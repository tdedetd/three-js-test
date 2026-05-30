import * as THREE from 'three';
import { generateRoad } from './roads/functions/generate-road';

export function generateDistrict(): THREE.Group {
  const group = new THREE.Group();
  group.add(generateRoad([-8, 8], [-8, -8]));
  return group;
}
