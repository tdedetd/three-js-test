import { Component, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { getCityScene } from '../../utils/get-city-scene';

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
  private effectComposer: EffectComposer

  constructor() {
    const renderer = inject(Renderer2);

    const scene = getCityScene();
    scene.background = new THREE.Color(0xff3604);
    scene.fog = new THREE.Fog(0xff3604, 1500, 3500);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;

    const pixelRatio = window.devicePixelRatio;
    this.renderer.setPixelRatio(pixelRatio * 2);

    this.camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 8000);
    this.camera.position.set(167, 129, 65);

    const renderPass = new RenderPass(scene, this.camera);

    const bloomPassStrength = 0.3;
    const bloomPassRadius = 0.4;
    const bloomPassThreshold = 0.2;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(0, 0),
      bloomPassStrength,
      bloomPassRadius,
      bloomPassThreshold,
    );

    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      samples: 8,
    });

    this.effectComposer = new EffectComposer(this.renderer, renderTarget);
    this.effectComposer.addPass(renderPass);
    this.effectComposer.addPass(bloomPass);

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
        this.effectComposer.render();
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
      this.effectComposer.setSize(width, height);

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
