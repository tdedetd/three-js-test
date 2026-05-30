import * as THREE from 'three';
import { SeededRandom } from '../perlin-noise/seeded-random';
import { DistrictOptions } from './models/district-options.model';
import { generatePerimeterRoads } from './utils/functions/generate-perimeter-roads';

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
      generatePerimeterRoads(this.options.roadWidth, this.options.innerSize)
    );

    return districtGroup;
  }
}
