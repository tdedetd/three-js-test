import { dot } from '../functions/dot';
import { lerp } from '../functions/lerp';
import { qunticCurve } from '../functions/quntic-curve';
import { toCartesian } from '../functions/to-cartesian';
import { PerlinNoiseLayerOptions } from './models/perlin-noise-layer-options.model';
import { Point } from '../../models/point.model';
import { PerlinNoiseCache } from './perlin-noise-cache';
import { SeededRandom } from './seeded-random';

export class PerlinNoiseLayer {
  private cache = new PerlinNoiseCache();
  private random: SeededRandom;
  private options: PerlinNoiseLayerOptions;

  constructor(options: PerlinNoiseLayerOptions, seed?: number) {
    this.options = options;
    this.random = new SeededRandom(seed);
  }

  public getValue(x: number, y: number): number {
    const closestMinX = Math.floor(x / this.options.gridSize) * this.options.gridSize;
    const closestMinY = Math.floor(y / this.options.gridSize) * this.options.gridSize;
    const closestMaxX = closestMinX + this.options.gridSize;
    const closestMaxY = closestMinY + this.options.gridSize;

    const tlGradient = this.getRandomGradientVector([closestMinX, closestMinY]);
    const trGradient = this.getRandomGradientVector([closestMaxX, closestMinY]);
    const blGradient = this.getRandomGradientVector([closestMinX, closestMaxY]);
    const brGradient = this.getRandomGradientVector([closestMaxX, closestMaxY]);

    const tlDistance: Point = { x: x - closestMinX, y: y - closestMinY };
    const trDistance: Point = { x: x - closestMaxX, y: y - closestMinY };
    const blDistance: Point = { x: x - closestMinX, y: y - closestMaxY };
    const brDistance: Point = { x: x - closestMaxX, y: y - closestMaxY };

    const tlDot = dot(tlGradient, tlDistance);
    const trDot = dot(trGradient, trDistance);
    const blDot = dot(blGradient, blDistance);
    const brDot = dot(brGradient, brDistance);

    const tx = qunticCurve((x - closestMinX) / this.options.gridSize);
    const ty = qunticCurve((y - closestMinY) / this.options.gridSize);

    const tLerp = lerp(tlDot, trDot, tx);
    const bLerp = lerp(blDot, brDot, tx);
    return lerp(tLerp, bLerp, ty) / this.options.gridSize;
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
