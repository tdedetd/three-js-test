interface CoordsIntervalOptions {
  min: number,
  max: number,
  interval?: number,
}

export function coordsInterval2d(
  { min, max, interval }: CoordsIntervalOptions,
  fn: (x: number, y: number) => void,
): void {
  const intervalResult = interval ?? 1;
  for (let y = min; y <= max; y += intervalResult) {
    for (let x = min; x <= max; x += intervalResult) {
      fn(x, y);
    }
  }
}
