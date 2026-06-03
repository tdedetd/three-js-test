import { Point } from '../../../../models/point.model';
import { Rectangle } from '../../../../models/rectangle.model';

export function getRectanglePatchSeed(
  rectangle: Rectangle,
  additionalPoint: Point = { x: 0, y: 0 },
): number {
  return (
    (rectangle[0].x + additionalPoint.x) +
    (rectangle[0].y + additionalPoint.y) * 1000000 +
    (rectangle[1].x + additionalPoint.x) * 1000000000000 +
    (rectangle[1].y + additionalPoint.y) * 1000000000000000000
  );
}
