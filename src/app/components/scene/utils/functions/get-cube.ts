import * as THREE from 'three';

export function getCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff80f2,
    roughness: 0.194,
    metalness: 0.639,
  });
  return new THREE.Mesh(geometry, material);
}
