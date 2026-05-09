import * as THREE from 'three';

export function getPlane() {
  const geometry = new THREE.PlaneGeometry(300, 300);
  const material = new THREE.MeshStandardMaterial({
    color: 0xede8b7,
    roughness: 0.6,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}
