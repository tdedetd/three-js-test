import { Rectangle } from '../../models/rectangle.model';

export function getRectangleSize(rectangle: Rectangle): { xSize: number, ySize: number } {
  return {
    xSize: Math.abs(rectangle[0].x - rectangle[1].x),
    ySize: Math.abs(rectangle[0].y - rectangle[1].y),
  };
}
