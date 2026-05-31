export interface DistrictOptions {
  /** In meters */
  innerSize: number;

  /** In meters */
  roadWidth: number;

  /** In meters */
  minCityBlockSize: number;

  cityBlockOptions: CityBlockOptions;

  seed?: number;
}

export interface CityBlockOptions {
  roadOffset: number;
  minBuildingSize: number;
  minBuildingsGap: number;
  maxBuildingsGap: number;
}
