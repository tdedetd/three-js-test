import * as THREE from 'three';
import { City } from './city/city';
import { generateLandscape } from '../components/scene/utils/functions/generate-landscape';
import { generateSkybox } from '../components/scene/utils/functions/generate-skybox';

export function getCityScene(): THREE.Scene {
  const scene = new THREE.Scene();

  {
    const city = new City({
      innerSize: 4000,
      roadWidth: 13,
      minCityBlockSize: 100,
      cityBlockOptions: {
        roadOffset: 15,
        minBuildingSize: 18,
        minBuildingsGap: 8,
        maxBuildingsGap: 20,
      },
      seed: 574829103718473,
    });
    scene.add(city.group);
  }

  addLights(scene);
  scene.add(generateLandscape());
  scene.add(generateSkybox());

  return scene;
}

function addLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(2000, 300, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;

  directionalLight.shadow.bias = -0.0001;

  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 20000;
  directionalLight.shadow.camera.left = -2000;
  directionalLight.shadow.camera.right = 2000;
  directionalLight.shadow.camera.top = 2000;
  directionalLight.shadow.camera.bottom = -2000;

  scene.add(directionalLight);

  // const lightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(lightHelper);
}
