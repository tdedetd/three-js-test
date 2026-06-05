import { PerlinNoiseLayer } from './perlin-noise-layer';

interface PerlinNoiseOptions {
  gridSize: number;
  octaves?: number;
  persistance?: number;
  seed?: number;
}

export class PerlinNoise {
  private layers: PerlinNoiseLayer[];
  private options: PerlinNoiseOptions;

  constructor(options: PerlinNoiseOptions) {
    this.options = options;
    this.layers = this.getLayers();
  }

  public getValue(x: number, y: number): number {
    let value = 0;
    let amplitude = 1;
    let maxAmplitude = 0;

    for (const layer of this.layers) {
      value += layer.getValue(x, y) * amplitude;
      maxAmplitude = maxAmplitude + amplitude;
      amplitude = amplitude * (this.options.persistance ?? 0.5);
    }

    return value / maxAmplitude;
  }

  private getLayers(): PerlinNoiseLayer[] {
    const layers: PerlinNoiseLayer[] = [];

    let currentGridSize = this.options.gridSize;
    let octavesCounter = this.options.octaves ?? 1;

    while (octavesCounter > 0) {
      layers.push(new PerlinNoiseLayer(currentGridSize, this.options.seed));
      currentGridSize = currentGridSize / 2;
      octavesCounter--;
    }

    return layers;
  }
}
