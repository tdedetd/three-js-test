import { Component, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { City } from '../../utils/city/city';
import { generateSkybox } from './utils/functions/generate-skybox';
import { generateLandscape } from './utils/functions/generate-landscape';

@Component({
  selector: 'app-scene',
  imports: [],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene {
  private elementRef = inject(ElementRef);

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  constructor() {
    const renderer = inject(Renderer2);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff3604);
    scene.fog = new THREE.Fog(0xff3604, 1500, 3500);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 8000);
    this.camera.position.set(167, 129, 65);

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

    {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);
    }

    {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
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

    {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.update();

      // controls.addEventListener('change', () => {
      //   console.log(this.camera.position);
      // });
    }

    scene.add(generateLandscape());
    scene.add(generateSkybox());

    this.addGrid(scene, 20);

    effect(() => {
      renderer.appendChild(this.elementRef.nativeElement, this.renderer.domElement);
      this.updateSizes();

      const animate: XRFrameRequestCallback = (time) => {
        this.renderer.render(scene, this.camera);
      };

      this.renderer.setAnimationLoop(animate);
    });
  }

  @HostListener('window:resize')
  protected handleWindowResize(): void {
    this.updateSizes();
  }

  private updateSizes(): void {
    const element = this.elementRef.nativeElement;
    if (element instanceof HTMLElement) {
      const width = element.clientWidth;
      const height = element.clientHeight;
      this.renderer.setSize(width, height);

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private addGrid(scene: THREE.Scene<THREE.Object3DEventMap>, size: number): void {
    const axesHelper = new THREE.AxesHelper(30);
    axesHelper.position.y = 0.1
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(size, size);
    scene.add(gridHelper);
  }
}
