import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import frag from './shaders/example-frag.glsl'
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model';
import Composer from './composer';

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;

const renderer = Renderer({containerEl, clearColor: 0xFF00FF});
const { outlineScene, colorScene, maskScene, camera } = Scene({
  cameraPos: [0, 0, 25],
  cameraAspect: cW / cH,
  cameraFov: 45
});

const controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.enableKeys = true;

ImportModel().then(({ meshGroup, colorModel }) => {
  outlineScene.add(meshGroup);

  const { composer, composer2, bloomPass } = Composer({
    renderer,
    camera,
    width: cW * window.devicePixelRatio,
    height: cH * window.devicePixelRatio,
    outlineScene
  });
  const ctx = renderer.getContext();
  const pixels = new Uint8Array(ctx.drawingBufferWidth * ctx.drawingBufferHeight * 4)
  ctx.getImageData = (a, b, c, d) => {
    return {
      data: ctx.readPixels(a, b, c, d, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels)
    }
  };
  RenderLoop({ renderer, ctx, composer, composer2, bloomPass, camera, controls, rotateMesh: meshGroup });
});

window.addEventListener('resize', () => {
  // Need to update composer here I think
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  camera.aspect = cW / cH;
  camera.updateProjectionMatrix();
});

