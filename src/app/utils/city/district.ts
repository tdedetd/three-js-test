import * as THREE from 'three';
import { SeededRandom } from '../perlin-noise/seeded-random';
import { DistrictOptions } from './models/district-options.model';
import { generatePerimeterRoads } from './utils/functions/generate-perimeter-roads';
import { Rectangle } from '../../models/rectangle.model';
import { generateRoad } from './utils/functions/generate-road';
import { getRectanglePatchSeed } from './utils/functions/get-rectangle-patch-seed';
import { subdivideRectangle } from './utils/functions/subsivide-rectangle';
import { insetRectangle } from '../functions/inset-rectangle';
import { Point } from '../../models/point.model';
import { getRectangleSize } from '../functions/get-rectangle-size';
import { generateBuilding } from './utils/functions/generate-building';

export class District {
  public readonly group: THREE.Group;
  private random: SeededRandom;
  private options: DistrictOptions;
  private halfRoadWidth: number;
  private center: Point;

  constructor(options: DistrictOptions, center: Point) {
    this.random = new SeededRandom(options.seed);
    this.options = options;
    this.center = center;
    this.halfRoadWidth = options.roadWidth / 2;

    this.group = this.generate();
  }

  private generate(): THREE.Group {
    const districtGroup = new THREE.Group();
    districtGroup.name = 'District';
    districtGroup.position.x = this.center.x;
    districtGroup.position.z = this.center.y;

    districtGroup.add(
      generatePerimeterRoads(this.options.roadWidth, this.options.innerSize)
    );

    const [districtRoads, cityBlocks] = this.divideByCityBlocks();
    districtGroup.add(districtRoads);

    districtGroup.add(
      this.generateBuildings(cityBlocks)
    );

    return districtGroup;
  }

  private divideByCityBlocks(): [THREE.Group, Rectangle[]] {
    const halfInnerSize = this.options.innerSize / 2;
    const districtRoads = new THREE.Group();
    districtRoads.name = 'DistrictRoads';

    const initialCityBlock: Rectangle = [
      { x: -halfInnerSize, y: -halfInnerSize },
      { x: halfInnerSize, y: halfInnerSize },
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
    const { xSize, ySize } = getRectangleSize(cityBlock);
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
    const minX = Math.min(cityBlock[0].x, cityBlock[1].x);
    const maxX = Math.max(cityBlock[0].x, cityBlock[1].x);
    const minY = Math.min(cityBlock[0].y, cityBlock[1].y);
    const maxY = Math.max(cityBlock[0].y, cityBlock[1].y);

    const patchSeed = getRectanglePatchSeed(cityBlock, this.center);

    if (divideBy === 'x') {
      const x = this.random.interval(minX + minSpacing, maxX - minSpacing, patchSeed);
      const road = generateRoad(
        this.options.roadWidth,
        { x, y: minY + this.halfRoadWidth },
        { x, y: maxY - this.halfRoadWidth },
      );

      const newCityBlocks: Rectangle[] = [
        [
          { x: minX, y: minY },
          { x: x - this.halfRoadWidth, y: maxY },
        ],
        [
          { x: x + this.halfRoadWidth, y: minY },
          { x: maxX, y: maxY },
        ],
      ];

      return [road, newCityBlocks];
    } else {
      const y = this.random.interval(minY + minSpacing, maxY - minSpacing, patchSeed);
      const road = generateRoad(
        this.options.roadWidth,
        { x: minX + this.halfRoadWidth, y },
        { x: maxX - this.halfRoadWidth, y },
      );

      const newCityBlocks: Rectangle[] = [
        [
          { x: minX, y: minY },
          { x: maxX, y: y - this.halfRoadWidth }
        ],
        [
          { x: minX, y: y + this.halfRoadWidth },
          { x: maxX, y: maxY },
        ],
      ];

      return [road, newCityBlocks];
    }
  }

  private generateBuildings(cityBlocks: Rectangle[]): THREE.Group {
    const buildings = new THREE.Group();
    buildings.name = 'Buildings';

    cityBlocks.forEach((cityBlock) => {
      const patchSeed = getRectanglePatchSeed(cityBlock, this.center);

      const buildingsRectangles = this.generateBuildingsForCityBlock(
        cityBlock,
        this.random.options(['x', 'y'], patchSeed),
      );

      buildings.add(
        ...buildingsRectangles.map(
          (buildingRectangle) => generateBuilding(buildingRectangle, 10)
        ),
      );
    });

    return buildings;
  }

  private generateBuildingsForCityBlock(
    cityBlock: Rectangle,
    divideBy: 'x' | 'y',
  ): Rectangle[] {
    const rectangle = insetRectangle(cityBlock, this.options.cityBlockOptions.roadOffset);
    return this.generateBuildingsForCityBlockIteration(rectangle, divideBy, 2);
  }

  private generateBuildingsForCityBlockIteration(
    rectangle: Rectangle,
    divideBy: 'x' | 'y',
    iterationsRemaining: number,
  ): Rectangle[] {
    if (iterationsRemaining === 0) {
      return [rectangle];
    }

    const patchSeed = getRectanglePatchSeed(rectangle, this.center);
    const gap = this.random.interval(
      this.options.cityBlockOptions.minBuildingsGap,
      this.options.cityBlockOptions.maxBuildingsGap,
      patchSeed,
    );

    const newRectangles = subdivideRectangle(
      rectangle,
      this.random,
      {
        divideBy,
        gap,
        offset: this.options.cityBlockOptions.minBuildingSize,
      },
    );

    return newRectangles.reduce<Rectangle[]>((acc, newRectangle) => [
      ...acc,
      ...this.generateBuildingsForCityBlockIteration(
        newRectangle,
        divideBy === 'x' ? 'y' : 'x',
        iterationsRemaining - 1,
      ),
    ], []);
  }
}
