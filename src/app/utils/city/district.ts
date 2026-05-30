import * as THREE from 'three';
import { SeededRandom } from '../perlin-noise/seeded-random';
import { DistrictOptions } from './models/district-options.model';
import { generateRoad } from './utils/functions/generate-road';

export class District {
  public readonly group: THREE.Group;
  private random: SeededRandom;
  private options: DistrictOptions;

  constructor(options: DistrictOptions) {
    this.random = new SeededRandom(options.seed);
    this.options = options;
    this.group = this.generate();
  }

  private generate(): THREE.Group {
    const districtGroup = new THREE.Group();
    districtGroup.name = 'District';
  
    districtGroup.add(
      this.generatePerimeterRoads()
    );
  
    return districtGroup;
  }

  private generatePerimeterRoads(): THREE.Group {
    const roadHalfWidth = this.options.roadWidth / 2;
    const halfInnerSize = this.options.innerSize / 2;

    const roadLeft = this.generateRoad(
      [-halfInnerSize - roadHalfWidth, -halfInnerSize + roadHalfWidth],
      [-halfInnerSize - roadHalfWidth, halfInnerSize - roadHalfWidth],
      'PerimeterRoad',
    );

    const roadTop = this.generateRoad(
      [-halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
      [halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
      'PerimeterRoad',
    );

    const roadRight = this.generateRoad(
      [halfInnerSize + roadHalfWidth, -halfInnerSize + roadHalfWidth],
      [halfInnerSize + roadHalfWidth, halfInnerSize - roadHalfWidth],
      'PerimeterRoad',
    );

    const roadBottom = this.generateRoad(
      [-halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
      [halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
      'PerimeterRoad',
    );

    const crossroadTopLeft = this.generateRoad(
      [-halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
      [-halfInnerSize - roadHalfWidth, -halfInnerSize - roadHalfWidth],
      'PerimeterCrossroad',
    );

    const crossroadTopRight = this.generateRoad(
      [halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
      [halfInnerSize + roadHalfWidth, -halfInnerSize - roadHalfWidth],
      'PerimeterCrossroad',
    );

    const crossroadBottomLeft = this.generateRoad(
      [-halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
      [-halfInnerSize - roadHalfWidth, halfInnerSize + roadHalfWidth],
      'PerimeterCrossroad',
    );

    const crossroadBottomRight = this.generateRoad(
      [halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
      [halfInnerSize + roadHalfWidth, halfInnerSize + roadHalfWidth],
      'PerimeterCrossroad',
    );

    const group = new THREE.Group();
    group.name = 'PerimeterRoad';
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

  private generateRoad(
    from: [number, number],
    to: [number, number],
    customName?: string
  ) {
    return generateRoad(this.options.roadWidth, from, to, customName);
  }
}
