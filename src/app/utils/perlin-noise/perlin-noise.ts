import { dot } from '../functions/dot';
import { lerp } from '../functions/lerp';
import { qunticCurve } from '../functions/quntic-curve';
import { toCartesian } from '../functions/to-cartesian';
import { Point } from './models/point.model';
import { PerlinNoiseCache } from './perlin-noise-cache';
import { SeededRandom } from './seeded-random';

export interface PerlinNoiseLayer {
  gridSize: number;
}

export class PerlinNoise {
  private layer: PerlinNoiseLayer;
  private cache = new PerlinNoiseCache();
  private random: SeededRandom;

  constructor(layer: PerlinNoiseLayer, seed?: number) {
    this.layer = layer;
    this.random = new SeededRandom(seed);
  }

  public getValue(x: number, y: number): number {
    const closestMinX = Math.floor(x / this.layer.gridSize) * this.layer.gridSize;
    const closestMinY = Math.floor(y / this.layer.gridSize) * this.layer.gridSize;
    const closestMaxX = closestMinX + this.layer.gridSize;
    const closestMaxY = closestMinY + this.layer.gridSize;

    const tlGradient = this.getRandomGradientVector([closestMinX, closestMinY]);
    const trGradient = this.getRandomGradientVector([closestMaxX, closestMinY]);
    const blGradient = this.getRandomGradientVector([closestMinX, closestMaxY]);
    const brGradient = this.getRandomGradientVector([closestMaxX, closestMaxY]);

    const tlDistance: Point = [x - closestMinX, y - closestMinY];
    const trDistance: Point = [x - closestMaxX, y - closestMinY];
    const blDistance: Point = [x - closestMinX, y - closestMaxY];
    const brDistance: Point = [x - closestMaxX, y - closestMaxY];

    const tlDot = dot(tlDistance, tlGradient);
    const trDot = dot(trDistance, trGradient);
    const blDot = dot(blDistance, blGradient);
    const brDot = dot(brDistance, brGradient);

    const pointInGrid: Point = [x - closestMinX, y - closestMinY];
    const fadedPointInGrid: Point = [qunticCurve(pointInGrid[0]), qunticCurve(pointInGrid[1])];

    const tLerp = lerp(tlDot, trDot, fadedPointInGrid[0]);
    const bLerp = lerp(blDot, brDot, fadedPointInGrid[0]);
    return lerp(tLerp, bLerp, fadedPointInGrid[1]);
  }

  private getRandomGradientVector(point: [number, number]): Point {
    const cachedGridVector = this.cache.getGridVector(point[0], point[1]);
    if (cachedGridVector) {
      return cachedGridVector;
    }

    const seed = point[0] * 1000000000 + point[1];
    const angleRad = this.random.interval(0, Math.PI * 2, seed);
    const gridVector: Point = toCartesian(1, angleRad);
    this.cache.setGridVector(point[0], point[1], gridVector);
    return gridVector;
  }
}
