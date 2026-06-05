import * as THREE from 'three';
import skyboxVert from './shaders/skybox-vert.glsl';
import skyboxFrag from './shaders/skybox-frag.glsl';

export function generateSkybox() {
  const geometry = new THREE.BoxGeometry(4000, 4000, 4000);
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
      from: { value: new THREE.Color(0xff0339) },
      to: { value: new THREE.Color(0xffa203) },
    },
    vertexShader: skyboxVert,
    fragmentShader: skyboxFrag,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const cube = new THREE.Mesh(geometry, shaderMaterial);
  return cube;
}
