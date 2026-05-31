import { Rectangle } from '../../../../models/rectangle.model';

export function getRectanglePatchSeed(rectangle: Rectangle): number {
  return rectangle[0].x + rectangle[0].y * 1000000
    + rectangle[1].x * 1000000000000 + rectangle[1].y * 1000000000000000000;
}
