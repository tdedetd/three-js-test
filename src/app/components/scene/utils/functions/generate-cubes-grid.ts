import * as THREE from 'three';
import { coordsInterval2d } from '../../../../utils/functions/coords-interval-2d';
import { generateCube } from './generate-cube';
import { mixColors } from '../../../../utils/functions/mix-colors';
import { PerlinNoise } from '../../../../utils/perlin-noise/perlin-noise';

const minHeight = -4;
const maxHeight = 4;

export function generateCubesGrid(
  scene: THREE.Scene<THREE.Object3DEventMap>,
  length: number,
): void {
  const perlinNoise = new PerlinNoise({
    gridSize: 5,
  }, 574829103718473);

  const result = coordsInterval2d({ min: 0.5, max: length - 1 + 0.5 }, (x, y) => {
    const cubeHeight = perlinNoise.getValue(x, y);
    const color = mixColors([0, 0, 0], [255, 255, 255], (cubeHeight - minHeight) / (maxHeight - minHeight));
    const cube = generateCube(new THREE.Color(`rgb(${color[0]}, ${color[1]}, ${color[2]})`));

    cube.position.x = x;
    cube.position.z = y;
    cube.position.y = cubeHeight;
    scene.add(cube);

    return cubeHeight;
  });

  console.info(result);
}
