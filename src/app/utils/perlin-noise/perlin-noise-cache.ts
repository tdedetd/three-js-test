import { GridVector } from './models/grid-vector.model';

export class PerlinNoiseCache {
  private gridVectors: Partial<Record<string, GridVector>> = {};

  public getGridVector(x: number, y: number): GridVector | undefined {
    const id = this.getGridVectorId(x, y);
    return this.gridVectors[id];
  }

  public setGridVector(x: number, y: number, gridVector: GridVector): void {
    const id = this.getGridVectorId(x, y);
    this.gridVectors[id] = gridVector;
  }

  private getGridVectorId(x: number, y: number): string {
    return `${x}_${y}`;
  }
}
