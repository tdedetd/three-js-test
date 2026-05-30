import * as THREE from 'three';
import { SeededRandom } from '../perlin-noise/seeded-random';
import { DistrictOptions } from './models/district-options.model';
import { generatePerimeterRoads } from './utils/functions/generate-perimeter-roads';
import { Rectangle } from '../../models/rectangle.model';
import { generateRoad } from './utils/functions/generate-road';

export class District {
  public readonly group: THREE.Group;
  private random: SeededRandom;
  private options: DistrictOptions;
  private halfRoadWidth: number;

  constructor(options: DistrictOptions) {
    this.random = new SeededRandom(options.seed);
    this.options = options;
    this.halfRoadWidth = options.roadWidth / 2;

    this.group = this.generate();
  }

  private generate(): THREE.Group {
    const districtGroup = new THREE.Group();
    districtGroup.name = 'District';

    districtGroup.add(
      generatePerimeterRoads(this.options.roadWidth, this.options.innerSize)
    );

    const [districtRoads, cityBlocks] = this.divideByCityBlocks();
    districtGroup.add(districtRoads);
    console.log('cityBlocks', cityBlocks);

    return districtGroup;
  }

  private divideByCityBlocks(): [THREE.Group, Rectangle[]] {
    const halfInnerSize = this.options.innerSize / 2;
    const districtRoads = new THREE.Group();
    districtRoads.name = 'DistrictRoads';

    const initialCityBlock: Rectangle = [
      [-halfInnerSize, -halfInnerSize],
      [halfInnerSize, halfInnerSize],
    ];

    const cityBlocks = this.divideByCityBlocksIterations(
      'y',
      districtRoads,
      initialCityBlock,
      2,
    );
    return [districtRoads, cityBlocks];
  }

  private divideByCityBlocksIterations(
    divideBy: 'x' | 'y',
    districtRoads: THREE.Group,
    cityBlock: Rectangle,
    iterationsRemaining: number,
  ): Rectangle[] {
    if (iterationsRemaining === 0) {
      return [cityBlock];
    }

    const minSpacing = this.options.minCityBlockSize + this.halfRoadWidth;

    const minX = Math.min(cityBlock[0][0], cityBlock[1][0]);
    const maxX = Math.max(cityBlock[0][0], cityBlock[1][0]);
    const minY = Math.min(cityBlock[0][1], cityBlock[1][1]);
    const maxY = Math.max(cityBlock[0][1], cityBlock[1][1]);

    if (divideBy === 'x') {
      const x = this.random.interval(minX + minSpacing, maxX - minSpacing);
      const road = generateRoad(
        this.options.roadWidth,
        [x, minY + this.halfRoadWidth],
        [x, maxY - this.halfRoadWidth],
      );
      districtRoads.add(road);

      const newCityBlocks: Rectangle[] = [
        [
          [minX, minY],
          [x - this.halfRoadWidth, maxY],
        ],
        [
          [x + this.halfRoadWidth, minY],
          [maxX, maxY],
        ],
      ];

      return newCityBlocks.reduce<Rectangle[]>((acc, newCityBlock) => [
        ...acc,
        ...this.divideByCityBlocksIterations(
          'y',
          districtRoads,
          newCityBlock,
          iterationsRemaining - 1,
        ),
      ], []);
    } else {
      const y = this.random.interval(minY + minSpacing, maxY - minSpacing);
      const road = generateRoad(
        this.options.roadWidth,
        [minX + this.halfRoadWidth, y],
        [maxX - this.halfRoadWidth, y],
      );
      districtRoads.add(road);

      const newCityBlocks: Rectangle[] = [
        [
          [minX, minY],
          [maxX, y - this.halfRoadWidth],
        ],
        [
          [minX, y + this.halfRoadWidth],
          [maxX, maxY],
        ],
      ];

      return newCityBlocks.reduce<Rectangle[]>((acc, newCityBlock) => [
        ...acc,
        ...this.divideByCityBlocksIterations(
          'x',
          districtRoads,
          newCityBlock,
          iterationsRemaining - 1,
        ),
      ], []);
    }
  }
}
