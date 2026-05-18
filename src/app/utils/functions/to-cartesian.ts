export function toCartesian(radius: number, angleRad: number): [number, number] {
  return [radius * Math.cos(angleRad), radius * Math.sin(angleRad)];
}
