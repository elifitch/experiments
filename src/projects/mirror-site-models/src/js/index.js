import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model';
import 'three/OrbitControls';

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;

const renderer = Renderer({ containerEl, clearColor: 0xFAFAFA });
const { scene, camera } = Scene({
  cameraPos: [0, 0, 3],
  cameraAspect: cW / cH,
  cameraFov: 45
});

const controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;

ImportModel().then(suzanne => {
  scene.add(suzanne);
});

window.addEventListener('resize', () => {
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  camera.aspect = cW / cH;
  camera.updateProjectionMatrix();
});

RenderLoop({ renderer, scene, camera, controls });
