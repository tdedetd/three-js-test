import * as THREE from 'three';
import { District } from './district';
import { DistrictOptions } from './models/district-options.model';
import { Point } from '../../models/point.model';
import { PerlinNoise } from '../perlin-noise/perlin-noise';

export class City {
  public readonly group: THREE.Group;
  private districtOptions: DistrictOptions;
  private perlinNoise: PerlinNoise;

  constructor(districtOptions: DistrictOptions) {
    this.group = new THREE.Group();
    this.group.name = 'City';
    this.districtOptions = districtOptions;

    this.perlinNoise = new PerlinNoise({
      gridSize: 1000,
      octaves: 3,
      persistance: 0.5,
      seed: 574829103718473,
    });

    this.generateDistrict({ x: 0, y: 0 });
  }

  private generateDistrict(gridCoords: Point): void {
    const center: Point = {
      x: this.districtOptions.innerSize * gridCoords.x + this.districtOptions.roadWidth * gridCoords.x,
      y: this.districtOptions.innerSize * gridCoords.y + this.districtOptions.roadWidth * gridCoords.y,
    };

    const district = new District(this.districtOptions, center, this.perlinNoise);
    this.group.add(district.group);
  }
}
