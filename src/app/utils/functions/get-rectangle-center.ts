import { Point } from '../../models/point.model';
import { Rectangle } from '../../models/rectangle.model';
import { getRectangleSize } from './get-rectangle-size';

export function getRectangleCenter(rectangle: Rectangle): Point {
  const { xSize, ySize } = getRectangleSize(rectangle);
  return {
    x: Math.min(rectangle[0].x, rectangle[1].x) + xSize / 2,
    y: Math.min(rectangle[0].y, rectangle[1].y) + ySize / 2,
  };
}
