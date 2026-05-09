import * as THREE from 'three';

export function getSphere(geometryTranslate?: { x: number, y: number, z: number }) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);

  if (geometryTranslate) {
    geometry.translate(geometryTranslate.x, geometryTranslate.y, geometryTranslate.z);
  }

  const material = new THREE.MeshPhongMaterial({
    color: 0x770077,
    shininess: 70,
    flatShading: false,
  });
  return new THREE.Mesh(geometry, material);
}
