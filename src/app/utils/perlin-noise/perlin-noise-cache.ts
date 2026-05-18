import { Point } from './models/point.model';

export class PerlinNoiseCache {
  private gridVectors: Partial<Record<string, Point>> = {};

  public getGridVector(x: number, y: number): Point | undefined {
    const id = this.getGridVectorId(x, y);
    return this.gridVectors[id];
  }

  public setGridVector(x: number, y: number, gridVector: Point): void {
    const id = this.getGridVectorId(x, y);
    this.gridVectors[id] = gridVector;
  }

  private getGridVectorId(x: number, y: number): string {
    return `${x}_${y}`;
  }
}
