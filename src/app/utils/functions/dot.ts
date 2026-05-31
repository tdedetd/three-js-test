import { Point } from '../../models/point.model';

export function dot(vector1: Point, vector2: Point): number {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}
