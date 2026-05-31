import { seededRandom } from 'three/src/math/MathUtils.js';

export class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.random() * 1000000000000000;
  }

  public interval(min: number, max: number, patchSeed?: number): number {
    const value = this.getValue(patchSeed);
    return value * (max - min) + min;
  }

  public options<T>(options: T[], patchSeed?: number): T {
    const value = this.getValue(patchSeed);
    const index = Math.floor(options.length * value);
    return options[index];
  }

  private getValue(patchSeed?: number): number {
    const seed = this.seed + (patchSeed ?? 0);
    return seededRandom(seed);
  }
}
