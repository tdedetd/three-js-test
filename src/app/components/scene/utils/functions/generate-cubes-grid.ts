import * as THREE from 'three';
import { coordsInterval2d } from '../../../../utils/functions/coords-interval-2d';
import { generateCube } from './generate-cube';
import { randFloat } from 'three/src/math/MathUtils.js';
import { mixColors } from '../../../../utils/functions/mix-colors';
import { PerlinNoise } from '../../../../utils/perlin-noise/perlin-noise';

export function generateCubesGrid(
  scene: THREE.Scene<THREE.Object3DEventMap>,
  length: number,
): void {
  const perlinNoise = new PerlinNoise({
    gridSize: 5,
  }, 574829103718473);
  console.log(perlinNoise.getValue(0.5, 0.5));

  coordsInterval2d({ min: 0.5, max: length - 1 + 0.5 }, (x, y) => {
    const cubeHeight = randFloat(0, length);
    const color = mixColors([0, 0, 0], [255, 255, 255], cubeHeight / length);
    const cube = generateCube(new THREE.Color(`rgb(${color[0]}, ${color[1]}, ${color[2]})`));

    cube.position.x = x;
    cube.position.z = y;
    cube.position.y = -0.5;
    scene.add(cube);
  });
}
