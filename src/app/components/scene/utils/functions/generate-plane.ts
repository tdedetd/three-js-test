import * as THREE from 'three';

export function generatePlane(width: number, height: number, color: THREE.Color) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}
