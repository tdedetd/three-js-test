import { Point } from '../perlin-noise/models/point.model';

export function dot(vector1: Point, vector2: Point): number {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}
