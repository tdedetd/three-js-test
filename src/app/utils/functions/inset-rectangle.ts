import { Rectangle } from '../../models/rectangle.model';

export function insetRectangle(rectangle: Rectangle, offset: number): Rectangle {
  const minX = Math.min(rectangle[0].x, rectangle[1].x);
  const maxX = Math.max(rectangle[0].x, rectangle[1].x);
  const minY = Math.min(rectangle[0].y, rectangle[1].y);
  const maxY = Math.max(rectangle[0].y, rectangle[1].y);

  return [
    { x: minX + offset, y: minY + offset },
    { x: maxX - offset, y: maxY - offset },
  ];
}
