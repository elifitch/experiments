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

const containerEl = document.getElementsByClassName('container')[0];
let cW = containerEl.offsetWidth;
let cH = containerEl.offsetHeight;

const renderer = Renderer({containerEl, clearColor: 0xFF00FF});
const { scene, camera } = Scene({
  cameraPos: [0, 0, 10],
  cameraAspect: cW / cH,
  cameraFov: 45
});

const controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.25;
controls.enableKeys = true;

ImportModel().then(model => {
  scene.add(model);
})

window.addEventListener('resize', () => {
  let cW = containerEl.offsetWidth;
  let cH = containerEl.offsetHeight;
  renderer.setSize(cW, cH);
  camera.aspect = cW / cH;
  camera.updateProjectionMatrix();
});

const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);


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
effectSobel.uniforms.resolution.value.x = window.innerWidth;
effectSobel.uniforms.resolution.value.y = window.innerHeight;
composer.addPass(effectSobel);

RenderLoop({ renderer: composer, scene, camera, controls });
