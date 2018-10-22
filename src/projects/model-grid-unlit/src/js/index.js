import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model';
import 'three/OrbitControls';
import distributePattern from './distribute-pattern';

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;
let wW = window.innerWidth;
let wH = window.innerHeight;

// TODO: need to figure a way to dynamically set the texture size
// based on the window size
let rtTexture = new THREE.WebGLRenderTarget(
  1024, 1024,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  }
);
rtTexture.texture.wrapS = THREE.RepeatWrapping;
rtTexture.texture.wrapT = THREE.RepeatWrapping;
rtTexture.texture.repeat.set(8, 4.5);

const renderer = Renderer({ containerEl, clearColor: 0xffffff });
const verticalOffset = -0.15;
const { scene: rttScene, camera: rttCamera } = Scene({
  cameraPos: [0, verticalOffset, 18],
  cameraAspect: 1,
  cameraFov: 20
});
const { scene: displayScene, camera: displayCamera } = Scene({
  cameraOverride: new THREE.OrthographicCamera(
    cW / -2,
    cW / 2,
    cH / 2,
    cH / -2,
    1, 1000
  ),
  cameraPos: [0, 0, 18],
  cameraAspect: window.innerWidth / window.innerHeight,
  cameraFov: 20
});

const controls = new THREE.OrbitControls(rttCamera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.target = new THREE.Vector3(0, verticalOffset, 0);

ImportModel().then(meshGroup => {
  rttScene.add(distributePattern(meshGroup));

  // ----------------------------
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
    new THREE.MeshBasicMaterial({ map: rtTexture.texture })
  );
  displayScene.add(plane);
});

window.addEventListener('resize', () => {
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  rttCamera.aspect = cW / cH;
  rttCamera.updateProjectionMatrix();
});

RenderLoop({ renderer, rtTexture, scenes: [rttScene, displayScene], cameras: [rttCamera, displayCamera], controls });
