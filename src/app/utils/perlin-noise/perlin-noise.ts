import { GridVector } from './models/grid-vector.model';
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

    const gridVectors = ([
      [closestMinX, closestMinY],
      [closestMaxX, closestMinY],
      [closestMinX, closestMaxY],
      [closestMaxX, closestMaxY],
    ] satisfies [number, number][]).map((point) => {
      const gridVector = this.cache.getGridVector(point[0], point[1]);
      if (gridVector) {
        return gridVector;
      }

      const seed = point[0] * 1000000000 + point[1];
      const angleRad = this.random.interval(0, Math.PI * 2, seed);
      const newGridVector: GridVector = {
        sin: Math.sin(angleRad),
        cos: Math.cos(angleRad),
      };
      this.cache.setGridVector(point[0], point[1], newGridVector);
      return newGridVector;
    });

    return 0;
  }
}
