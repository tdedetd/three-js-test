import { PerlinNoiseLayerOptions } from './models/perlin-noise-layer-options.model';
import { PerlinNoiseLayer } from './perlin-noise-layer';

export class PerlinNoise {
  private layers: PerlinNoiseLayer[];

  constructor(layersOptions: PerlinNoiseLayerOptions[], seed?: number) {
    this.layers = layersOptions.map((options) => new PerlinNoiseLayer(options, seed));
  }

  public getValue(x: number, y: number, persistance = 1): number {
    let value = 0;
    let amplitude = 1;
    let maxAmplitude = 0;

    for (const layer of this.layers) {
      value += layer.getValue(x, y) * amplitude;
      maxAmplitude = maxAmplitude + amplitude;
      amplitude = amplitude * persistance;
    }

    return value / maxAmplitude;
  }
}
