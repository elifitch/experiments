import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model';
import 'three/OrbitControls';
import distributePattern from './distribute-pattern';

const PATTERN_SCALE = 500;
const TEXTURE_RESOLUTION = 1024;

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;
const initialWidth = containerEl.offsetWidth;
const initialHeight = containerEl.offsetHeight;

let bgPlane;

// TODO: need to figure a way to dynamically set the texture size
// based on the window size
let rtTexture = new THREE.WebGLRenderTarget(
  TEXTURE_RESOLUTION, TEXTURE_RESOLUTION,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  }
);
rtTexture.texture.wrapS = THREE.RepeatWrapping;
rtTexture.texture.wrapT = THREE.RepeatWrapping;
rtTexture.texture.repeat.set(cW / PATTERN_SCALE, cH / PATTERN_SCALE);

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
  cameraAspect: cW / cH,
  cameraFov: 20
});

const controls = new THREE.OrbitControls(rttCamera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
controls.target = new THREE.Vector3(0, verticalOffset, 0);

ImportModel().then(meshGroup => {
  rttScene.add(distributePattern(meshGroup));

  // ----------------------------
  bgPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(cW, cH),
    new THREE.MeshBasicMaterial({ map: rtTexture.texture })
  );
  displayScene.add(bgPlane);
});

window.addEventListener('resize', () => {
  cW = containerEl.offsetWidth;
  cH = containerEl.offsetHeight;
  const scaleFactorW = cW / initialWidth;
  const scaleFactorH = cH / initialHeight;

  bgPlane.scale.set(scaleFactorW, scaleFactorH, 1);
  rtTexture.texture.repeat.set(cW / PATTERN_SCALE, cH / PATTERN_SCALE);

  renderer.setSize(cW, cH);

  displayCamera.left = cW / -2;
  displayCamera.right = cW / 2;
  displayCamera.top = cH / 2;
  displayCamera.bottom = cH / -2;
  displayCamera.updateProjectionMatrix();
});

RenderLoop({ renderer, rtTexture, scenes: [rttScene, displayScene], cameras: [rttCamera, displayCamera], controls });
