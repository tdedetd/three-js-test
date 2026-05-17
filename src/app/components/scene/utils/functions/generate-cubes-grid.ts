import * as THREE from 'three';
import { coordsInterval2d } from '../../../../utils/functions/coords-interval-2d';
import { generateCube } from './generate-cube';
import { randInt } from 'three/src/math/MathUtils.js';
import { mixColors } from '../../../../utils/functions/mix-colors';

export function generateCubesGrid(scene: THREE.Scene<THREE.Object3DEventMap>, size: number): void {
  coordsInterval2d({ min: -size, max: size }, (x, y) => {
    const height = randInt(0, size);
    const color = mixColors([0, 255, 0], [255, 0, 0], height / size);
    const cube = generateCube(new THREE.Color(`rgb(${color[0]}, ${color[1]}, ${color[2]})`));

    cube.position.x = x;
    cube.position.z = y;
    cube.position.y = height;
    scene.add(cube);
  });
}
