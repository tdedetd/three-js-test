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
      point1: { x: -halfInnerSize - roadHalfWidth, y: -halfInnerSize + roadHalfWidth },
      point2: { x: -halfInnerSize - roadHalfWidth, y: halfInnerSize - roadHalfWidth },
      name: 'PerimeterRoadLeft',
    },
    {
      point1: { x: -halfInnerSize + roadHalfWidth, y: -halfInnerSize - roadHalfWidth },
      point2: { x: halfInnerSize - roadHalfWidth, y: -halfInnerSize - roadHalfWidth },
      name: 'PerimeterRoadTop',
    },
    {
      point1: { x: halfInnerSize + roadHalfWidth, y: -halfInnerSize + roadHalfWidth },
      point2: { x: halfInnerSize + roadHalfWidth, y: halfInnerSize - roadHalfWidth },
      name: 'PerimeterRoadRight',
    },
    {
      point1: { x: -halfInnerSize + roadHalfWidth, y: halfInnerSize + roadHalfWidth },
      point2: { x: halfInnerSize - roadHalfWidth, y: halfInnerSize + roadHalfWidth },
      name: 'PerimeterRoadBottom',
    },
    {
      point1: { x: -halfInnerSize - roadHalfWidth, y: -halfInnerSize - roadHalfWidth },
      name: 'PerimeterCrossroadTopLeft',
    },
    {
      point1: { x: halfInnerSize + roadHalfWidth, y: -halfInnerSize - roadHalfWidth },
      name: 'PerimeterCrossroadTopRight',
    },
    {
      point1: { x: -halfInnerSize - roadHalfWidth, y: halfInnerSize + roadHalfWidth },
      name: 'PerimeterCrossroadBottomLeft',
    },
    {
      point1: { x: halfInnerSize + roadHalfWidth, y: halfInnerSize + roadHalfWidth },
      name: 'PerimeterCrossroadBottomRight',
    },
  ];

  roads.forEach(({ point1, point2, name }) => {
    const road = generateRoad(roadWidth, point1, point2 ?? point1, name);
    group.add(road);
  });

  return group;
}
