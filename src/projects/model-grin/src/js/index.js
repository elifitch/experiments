import '../css/reset.css';
import '../css/style.css';
import * as THREE from 'three';
import frag from './shaders/example-frag.glsl'
import Renderer from './renderer';
import Scene from './scene';
import RenderLoop from './render-loop';
import ImportModel from './import-model';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/shaders/LuminosityShader';
// import 'three/shaders/SobelOperatorShader';
import SobelOperatorShader from './custom-sobel';
import 'three/postprocessing/EffectComposer';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/shaders/HorizontalBlurShader';
import 'three/shaders/VerticalBlurShader';
import 'three/postprocessing/MaskPass';

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;

const renderer = Renderer({containerEl, alpha: true, antialias: true});
const goldToothRenderer = Renderer({ containerEl, alpha: true, antialias: true });
const cameraPos = [0, -0.4, 1.3];
const cameraFov = 30;
const { scene, camera } = Scene({
  cameraPos,
  cameraAspect: cW / cH,
  cameraFov
});
const { scene: goldToothScene, camera: goldToothCamera } = Scene({
  cameraPos,
  cameraAspect: cW / cH,
  cameraFov
});

const controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.enableKeys = true;
const goldToothControls = new THREE.OrbitControls(goldToothCamera);
goldToothControls.enableDamping = true;
goldToothControls.rotateSpeed = 0.5;
goldToothControls.dampingFactor = 0.25;
goldToothControls.enableKeys = true;



window.addEventListener('resize', () => {
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  camera.aspect = cW / cH;
  camera.updateProjectionMatrix();
});

const composer = new THREE.EffectComposer(renderer);

const maskOutTooth = new THREE.MaskPass(goldToothScene, camera);
const maskOutToothInverse = new THREE.MaskPass(goldToothScene, camera);
maskOutToothInverse.inverse = true;
const maskOutSkull = new THREE.MaskPass(scene, camera);
const maskOutSkullInverse = new THREE.MaskPass(scene, camera);
maskOutSkullInverse.inverse = true;
const clearMaskPass = new THREE.ClearMaskPass();

// const renderUniqueColorPass = new THREE.RenderPass(scene, camera);
// renderUniqueColorPass.clear = false;
// renderUniqueColorPass.renderToScreen = true;
// composer.addPass(renderUniqueColorPass);

const sobelInputPass = new THREE.RenderPass(scene, camera);
sobelInputPass.clear = true;
composer.addPass(sobelInputPass);

// Uncomment this for some crazy effects
// const hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
// // hBlur.uniforms.h.value = 0.2 / (window.innerWidth / 2);
// hBlur.uniforms.h.value = -0.2;
// composer.addPass(hBlur);

// const vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
// // vBlur.uniforms.v.value = 0.2 / (window.innerHeight / 2);
// vBlur.uniforms.v.value = -0.2;
// composer.addPass(vBlur);


const effectSobel = new THREE.ShaderPass(SobelOperatorShader);
effectSobel.renderToScreen = true;
// effectSobel.clear = false;
effectSobel.uniforms.resolution.value.x = window.innerWidth / 1.5;
effectSobel.uniforms.resolution.value.y = window.innerHeight / 1.5;
composer.addPass(effectSobel);


// function renderGoldToothScene() {
//   goldToothControls.update();
//   window.requestAnimationFrame(renderGoldToothScene);
//   goldToothRenderer.render();
// }
// renderGoldToothScene();







let camTarget = new THREE.Vector3(0, 0, 0);
ImportModel().then(({ meshGroup, goldTooth }) => {
  scene.add(meshGroup);
  goldToothScene.add(goldTooth);
  const bbox = new THREE.Box3().setFromObject(meshGroup);
  camTarget = bbox.getCenter();
  camera.lookAt(camTarget);
  goldToothCamera.lookAt(camTarget);
  controls.target = camTarget;
  goldToothControls.target = camTarget;

  RenderLoop({ renderer: composer, scene, camera, controls });
  RenderLoop({ renderer: goldToothRenderer, scene: goldToothScene, camera: goldToothCamera, controls: goldToothControls });
});
