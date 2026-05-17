import * as THREE from 'three';

export function generateCube(color: THREE.Color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color,
    wireframe,
    roughness: 0.194,
    metalness: 0.639,
  });
  return new THREE.Mesh(geometry, material);
}
