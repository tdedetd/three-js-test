import * as THREE from 'three';
import { coordsInterval2d } from '../../../../utils/functions/coords-interval-2d';
import { generateCube } from './generate-cube';
import { mixColors } from '../../../../utils/functions/mix-colors';
import { PerlinNoise } from '../../../../utils/perlin-noise/perlin-noise';

const minHeight = -1;
const maxHeight = 1;

export function generateCubesGrid(
  scene: THREE.Scene<THREE.Object3DEventMap>,
  length: number,
  cubeSize = 1,
): void {
  const perlinNoise = new PerlinNoise(
    [
      { gridSize: 16 },
      { gridSize: 8 },
      { gridSize: 4 },
      { gridSize: 2 },
      { gridSize: 1 },
    ],
    {
      seed: 574829103718473,
      persistance: 0.5,
    },
  );

  const result = coordsInterval2d(
    { min: 0.5, max: length - 1 + 0.5, interval: cubeSize },
    (x, y) => generateCubeWithNoise(x, y, scene, perlinNoise, cubeSize),
  );

  console.info(result);
}

function generateCubeWithNoise(
  x: number,
  y: number,
  scene: THREE.Scene<THREE.Object3DEventMap>,
  perlinNoise: PerlinNoise,
  cubeSize: number,
): number {
  const cubeHeight = perlinNoise.getValue(x, y);
  const color = mixColors([0, 0, 0], [255, 255, 255], (cubeHeight - minHeight) / (maxHeight - minHeight));
  const cube = generateCube(new THREE.Color(`rgb(${color[0]}, ${color[1]}, ${color[2]})`), cubeSize);

  cube.position.x = x;
  cube.position.z = y;
  cube.position.y = cubeHeight * 5;
  scene.add(cube);

  return cubeHeight * 5;
}
