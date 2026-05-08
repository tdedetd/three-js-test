import * as THREE from 'three';

export function getSphere() {
  const geometry = new THREE.SphereGeometry(0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0x770077,
  });
  return new THREE.Mesh(geometry, material);
}
