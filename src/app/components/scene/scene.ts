import { Component, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { getCube } from './utils/functions/get-cube';
import { getSphere } from './utils/functions/get-sphere';

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
    scene.background = new THREE.Color(0x050b1a);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 1000);
    this.camera.position.set(5, 2, 4);
    this.camera.lookAt(0, 0, 0);

    const cube = getCube();
    scene.add(cube);

    const sphere = getSphere();
    sphere.position.x = 3;
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff44aa, 10, 100, 1);
    pointLight.position.set(5, 2, 4);
    scene.add(pointLight);

    effect(() => {
      renderer.appendChild(this.elementRef.nativeElement, this.renderer.domElement);
      this.updateSizes();

      const animate: XRFrameRequestCallback = (time) => {
        cube.rotation.y = ((time / 10) % 360) * Math.PI / 180;
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
}
