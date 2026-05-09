import { Component, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { getCube } from './utils/functions/get-cube';
import { getSphere } from './utils/functions/get-sphere';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { getPlane } from './utils/functions/get-plane';

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
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 50, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;

    this.camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 1000);
    this.camera.position.set(5, 2, 4);
    this.camera.lookAt(0, 0, 0);

    const cube = getCube();
    cube.position.z = 2;
    cube.castShadow = true;
    scene.add(cube);

    const sphere = getSphere({ x: 3, y: 0, z: 0 });
    sphere.castShadow = true;
    scene.add(sphere);

    const plane = getPlane();
    plane.position.y = -0.5;
    plane.rotation.x = degToRad(-90);
    plane.receiveShadow = true;
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 6, 40, 1);
    pointLight.position.set(1, 2, 4);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();

    effect(() => {
      renderer.appendChild(this.elementRef.nativeElement, this.renderer.domElement);
      this.updateSizes();

      const animate: XRFrameRequestCallback = (time) => {
        cube.rotation.y = degToRad((time / 10) % 360);
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

  private addGrid(scene: THREE.Scene<THREE.Object3DEventMap>): void {
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }
}
