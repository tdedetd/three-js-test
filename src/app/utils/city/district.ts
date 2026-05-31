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

    const cityBlocks = this.divideByCityBlocksIteration(
      districtRoads,
      initialCityBlock,
      'y',
    );
    return [districtRoads, cityBlocks];
  }

  private divideByCityBlocksIteration(
    districtRoads: THREE.Group,
    cityBlock: Rectangle,
    divideBy?: 'x' | 'y',
  ): Rectangle[] {
    const xSize = Math.abs(cityBlock[0][0] - cityBlock[1][0]);
    const ySize = Math.abs(cityBlock[0][1] - cityBlock[1][1]);
    const maxSize = (this.options.minCityBlockSize * 2) + this.options.roadWidth;

    if (xSize < maxSize && ySize < maxSize) {
      return [cityBlock];
    }

    const [road, newCityBlocks] = this.getNewCityBlocksWithRoad(
      divideBy ?? (xSize > ySize ? 'x' : 'y'),
      cityBlock,
      maxSize / 2,
    );
    districtRoads.add(road);

    return newCityBlocks.reduce<Rectangle[]>((acc, newCityBlock) => {
      return [
        ...acc,
        ...this.divideByCityBlocksIteration(
          districtRoads,
          newCityBlock,
        ),
      ];
    }, []);
  }

  private getNewCityBlocksWithRoad(
    divideBy: 'x' | 'y',
    cityBlock: Rectangle,
    minSpacing: number,
  ): [THREE.Mesh, Rectangle[]] {
    const minX = Math.min(cityBlock[0][0], cityBlock[1][0]);
    const maxX = Math.max(cityBlock[0][0], cityBlock[1][0]);
    const minY = Math.min(cityBlock[0][1], cityBlock[1][1]);
    const maxY = Math.max(cityBlock[0][1], cityBlock[1][1]);

    const patchSeed = cityBlock[0][0] + cityBlock[0][1] * 1000000
      + cityBlock[1][0] * 1000000000000 + cityBlock[1][1] * 1000000000000000000;

    if (divideBy === 'x') {
      const x = this.random.interval(minX + minSpacing, maxX - minSpacing, patchSeed);
      const road = generateRoad(
        this.options.roadWidth,
        [x, minY + this.halfRoadWidth],
        [x, maxY - this.halfRoadWidth],
      );

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

      return [road, newCityBlocks];
    } else {
      const y = this.random.interval(minY + minSpacing, maxY - minSpacing, patchSeed);
      const road = generateRoad(
        this.options.roadWidth,
        [minX + this.halfRoadWidth, y],
        [maxX - this.halfRoadWidth, y],
      );

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

      return [road, newCityBlocks];
    }
  }
}
