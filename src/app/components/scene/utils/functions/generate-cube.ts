import * as THREE from 'three';

export function generateCube(
  color: THREE.Color,
  size: number,
  wireframe = false,
) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color,
    wireframe,
    roughness: 0.194,
    metalness: 0.639,
  });
  return new THREE.Mesh(geometry, material);
}
