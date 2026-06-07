import * as THREE from 'three';
import { Rectangle } from '../../../../models/rectangle.model';
import { getRectangleSize } from '../../../functions/get-rectangle-size';
import { getRectangleCenter } from '../../../functions/get-rectangle-center';

export function generateBuilding(
  rectangle: Rectangle,
  height: number,
  customName?: string,
) {
  const { xSize, ySize } = getRectangleSize(rectangle);
  const geometry = new THREE.BoxGeometry(xSize, height, ySize);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFF5555,
    roughness: 0.9,
    metalness: 0.2,
  });

  const center = getRectangleCenter(rectangle);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = customName ?? 'Building';
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.position.x = center.x;
  mesh.position.y = height / 2;
  mesh.position.z = center.y;

  return mesh;
}
