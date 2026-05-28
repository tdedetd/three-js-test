interface CoordsIntervalOptions {
  min: number,
  max: number,
  interval?: number,
}

export function coordsInterval2d(
  { min, max, interval }: CoordsIntervalOptions,
  fn: (x: number, y: number) => number,
): { min: number, max: number, count: number } {
  const intervalResult = interval ?? 1;
  let result = {
    min: Number.MAX_SAFE_INTEGER,
    max: -Number.MAX_SAFE_INTEGER,
    count: 0,
  };

  for (let y = min; y <= max; y += intervalResult) {
    for (let x = min; x <= max; x += intervalResult) {
      const value = fn(x, y);
      result.min = Math.min(result.min, value);
      result.max = Math.max(result.max, value);
      result.count += 1;
    }
  }

  return result;
}
