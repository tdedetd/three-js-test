import { Rectangle } from '../../../../models/rectangle.model';
import { SeededRandom } from '../../../perlin-noise/seeded-random';
import { getRectanglePatchSeed } from './get-rectangle-patch-seed';

interface SubdivideOptions {
  divideBy: 'x' | 'y';
  gap?: number;
  offset?: number;
}

export function subdivideRectangle(
  rectangle: Rectangle,
  random: SeededRandom,
  options: SubdivideOptions,
): [Rectangle, Rectangle] {
  const halfGap = (options.gap ?? 0) / 2;
  const intervalOffset = halfGap + (options.offset ?? 0);

  const minX = Math.min(rectangle[0].x, rectangle[1].x);
  const maxX = Math.max(rectangle[0].x, rectangle[1].x);
  const minY = Math.min(rectangle[0].y, rectangle[1].y);
  const maxY = Math.max(rectangle[0].y, rectangle[1].y);

  const patchSeed = getRectanglePatchSeed(rectangle);

  if (options.divideBy === 'x') {
    const x = random.interval(minX + intervalOffset, maxX - intervalOffset, patchSeed);
    return [
      [
        { x: minX, y: minY },
        { x: x - halfGap, y: maxY },
      ],
      [
        { x: x + halfGap, y: minY },
        { x: maxX, y: maxY },
      ],
    ];
  } else {
    const y = random.interval(minY + intervalOffset, maxY - intervalOffset, patchSeed);
    return [
      [
        { x: minX, y: minY },
        { x: maxX, y: y - halfGap }
      ],
      [
        { x: minX, y: y + halfGap },
        { x: maxX, y: maxY },
      ],
    ];
  }
}
