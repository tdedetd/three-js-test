import { PerlinNoiseLayerOptions } from './models/perlin-noise-layer-options.model';
import { PerlinNoiseLayer } from './perlin-noise-layer';

interface PerlinNoiseOptions {
  seed?: number;
  persistance?: number;
}

export class PerlinNoise {
  private layers: PerlinNoiseLayer[];
  private persistance: number;

  constructor(layersOptions: PerlinNoiseLayerOptions[], options?: PerlinNoiseOptions) {
    this.layers = layersOptions.map((layerOptions) => new PerlinNoiseLayer(layerOptions, options?.seed));
    this.persistance = options?.persistance ?? 1;
  }

  public getValue(x: number, y: number): number {
    let value = 0;
    let amplitude = 1;
    let maxAmplitude = 0;

    for (const layer of this.layers) {
      value += layer.getValue(x, y) * amplitude;
      maxAmplitude = maxAmplitude + amplitude;
      amplitude = amplitude * this.persistance;
    }

    return value / maxAmplitude;
  }
}
