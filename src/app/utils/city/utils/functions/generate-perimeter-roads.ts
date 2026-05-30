import * as THREE from 'three';
import { generateRoad } from './generate-road';
import { Point } from '../../../../models/point.model';

export function generatePerimeterRoads(roadWidth: number, innerSize: number): THREE.Group {
  const roadHalfWidth = roadWidth / 2;
  const halfInnerSize = innerSize / 2;

  const group = new THREE.Group();
  group.name = 'PerimeterRoad';

  const roads: {
    point1: Point,
    point2?: Point,
    name: string,
  }[] = [
    {
      point1: [-halfInnerSize - roadHalfWidth, -halfInnerSize + roadHalfWidth],
      point2: [-halfInnerSize - roadHalfWidth, halfInnerSize - roadHalfWidth],
      name: 'PerimeterRoadLeft',
    },
    {
      point1: [-halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
      point2: [halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
      name: 'PerimeterRoadTop',
    },
    {
      point1: [halfInnerSize + roadHalfWidth, -halfInnerSize + roadHalfWidth],
      point2: [halfInnerSize + roadHalfWidth, halfInnerSize - roadHalfWidth],
      name: 'PerimeterRoadRight',
    },
    {
      point1: [-halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
      point2: [halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
      name: 'PerimeterRoadBottom',
    },
    {
      point1: [-halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
      name: 'PerimeterCrossroadTopLeft',
    },
    {
      point1: [halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
      name: 'PerimeterCrossroadTopRight',
    },
    {
      point1: [-halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
      name: 'PerimeterCrossroadBottomLeft',
    },
    {
      point1: [halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
      name: 'PerimeterCrossroadBottomRight',
    },
  ];

  roads.forEach(({ point1, point2, name }) => {
    const road = generateRoad(roadWidth, point1, point2 ?? point1, name);
    group.add(road);
  });

  return group;
}
