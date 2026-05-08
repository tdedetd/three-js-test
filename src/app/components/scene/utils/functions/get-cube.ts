import * as THREE from 'three';

export function getCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 5,
    metalness: 0.5,
  });
  return new THREE.Mesh(geometry, material);
}
