import * as THREE from 'three';
import skyboxVert from './shaders/skybox-vert.glsl';
import skyboxFrag from './shaders/skybox-frag.glsl';

export function generateSkybox() {
  const geometry = new THREE.SphereGeometry(4000, 32, 16);
  const positionAttribute = geometry.getAttribute('position');

  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    minY = Math.min(minY, vertex.y);
    maxY = Math.max(maxY, vertex.y);
  }

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      minY: { value: minY },
      maxY: { value: maxY },
      from: { value: new THREE.Color(0xFF9500) },
      to: { value: new THREE.Color(0xB30000) },
    },
    vertexShader: skyboxVert,
    fragmentShader: skyboxFrag,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const cube = new THREE.Mesh(geometry, shaderMaterial);
  return cube;
}
