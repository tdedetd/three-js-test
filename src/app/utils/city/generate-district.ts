import * as THREE from 'three';
import { generateRoad } from './roads/functions/generate-road';
import { roadWidth } from './roads/const/road-width';

export function generateDistrict(innerSize: number): THREE.Group {
  const districtGroup = new THREE.Group();
  districtGroup.name = 'District';

  districtGroup.add(
    generatePerimeterRoads(innerSize, roadWidth)
  );

  return districtGroup;
}

function generatePerimeterRoads(innerSize: number, roadWidth: number): THREE.Group {
  const roadHalfWidth = roadWidth / 2;
  const halfInnerSize = innerSize / 2;

  const roadLeft = generateRoad(
    [-halfInnerSize - roadHalfWidth, -halfInnerSize + roadHalfWidth],
    [-halfInnerSize - roadHalfWidth, halfInnerSize - roadHalfWidth],
  );

  const roadTop = generateRoad(
    [-halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
    [halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
  );

  const roadRight = generateRoad(
    [halfInnerSize + roadHalfWidth, -halfInnerSize + roadHalfWidth],
    [halfInnerSize + roadHalfWidth, halfInnerSize - roadHalfWidth],
  );

  const roadBottom = generateRoad(
    [-halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
    [halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
  );

  const crossroadTopLeft = generateRoad(
    [-halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
    [-halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
  );

  const crossroadTopRight = generateRoad(
    [halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
    [halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
  );

  const crossroadBottomLeft = generateRoad(
    [-halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
    [-halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
  );

  const crossroadBottomRight = generateRoad(
    [halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
    [halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
  );

  const group = new THREE.Group();
  group.name = 'PerimeterRoads';
  group.add(
    roadLeft,
    roadTop,
    roadRight,
    roadBottom,
    crossroadTopLeft,
    crossroadTopRight,
    crossroadBottomLeft,
    crossroadBottomRight,
  );
  return group;
}
