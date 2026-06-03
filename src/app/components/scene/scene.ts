import { Component, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { City } from '../../utils/city/city';

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
    scene.background = new THREE.Color(0xad9d76);
    scene.fog = new THREE.Fog(0xad9d76, 1800, 2000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;

    this.camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 4000);
    this.camera.position.set(167, 129, 65);

    {
      const city = new City({
        innerSize: 4000,
        roadWidth: 10,
        minCityBlockSize: 100,
        cityBlockOptions: {
          roadOffset: 6,
          minBuildingSize: 16,
          minBuildingsGap: 7,
          maxBuildingsGap: 10,
        },
        seed: 574829103718473,
      });
      scene.add(city.group);
    }

    {
      const light = new THREE.PointLight(0xffffff, 1000, 1000000, 0.999);
      light.position.set(500, 30, 0);
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      scene.add(light);
    }

    {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.update();

      // controls.addEventListener('change', () => {
      //   console.log(this.camera.position);
      // });
    }

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
