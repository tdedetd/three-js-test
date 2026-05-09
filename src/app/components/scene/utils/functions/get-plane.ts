import * as THREE from 'three';

export function getPlane() {
  const geometry = new THREE.PlaneGeometry(50, 50);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    roughness: 0.6,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}
