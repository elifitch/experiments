import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import frag from './shaders/example-frag.glsl'
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model-json';
import Composer from './composer';

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;

const renderer = Renderer({containerEl, clearColor: 0xFF00FF});
const { innerScene, outlineScene, camera } = Scene({
  cameraPos: [0, 0, 3],
  cameraAspect: cW / cH,
  cameraFov: 45
});

const controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.enableKeys = true;

ImportModel().then(({ normalSkull, outlineSkull }) => {
  innerScene.add(normalSkull);
  outlineScene.add(outlineSkull);
  const { composer } = Composer({
    renderer,
    camera,
    width: cW * window.devicePixelRatio,
    height: cH * window.devicePixelRatio,
    innerScene,
    outlineScene
  });

  // RenderLoop({ renderer: renderer, controls, camera, scene: outlineScene });
  RenderLoop({ renderer: composer, controls, camera, scene: outlineScene });
});

window.addEventListener('resize', () => {
  // Need to update composer here I think
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  camera.aspect = cW / cH;
  camera.updateProjectionMatrix();
});

