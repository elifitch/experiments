import * as THREE from 'three';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/shaders/ConvolutionShader';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/postprocessing/MaskPass';
import 'three/postprocessing/ClearPass';
import 'three/postprocessing/BloomPass';
import SobelOperatorShader from './shaders/custom-sobel';
import customVerticalBlurShader from './shaders/custom-blur-v';
import customHorizontalBlurShader from './shaders/custom-blur-h';
import customTriangleBlurShader from './shaders/custom-triangle-blur';

function Composer({ renderer, camera, width, height, outlineScene, colorScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    // format: THREE.RGBAFormat,
    format: THREE.RGBFormat,
    stencilBuffer: true, // THIS is also important!
  }

  // const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams)
  // const composer = new THREE.EffectComposer(renderer, renderTarget);
  const composer = new THREE.EffectComposer(renderer);


  const clearPass = new THREE.ClearPass();

  const maskColorScene = new THREE.MaskPass(colorScene, camera);
  maskColorScene.inverse = true;
  const maskOutlineScene = new THREE.MaskPass(outlineScene, camera);
  maskOutlineScene.inverse = true;
  // maskOutlineScene.inverse = false;
  const clearMaskPass = new THREE.ClearMaskPass();

  const sobelInputPass = new THREE.RenderPass(outlineScene, camera);
  sobelInputPass.clear = false;
  sobelInputPass.renderToScreen = false;

  const colorPass = new THREE.RenderPass(colorScene, camera);
  colorPass.clear = false; // Important, should be
  colorPass.renderToScreen = false;

  const effectSobel = new THREE.ShaderPass(SobelOperatorShader);
  effectSobel.uniforms.resolution.value.x = width;
  effectSobel.uniforms.resolution.value.y = height;
  effectSobel.clear = false;
  effectSobel.renderToScreen = false;

  const copyPass = new THREE.ShaderPass(THREE.CopyShader);
  const outputPass = new THREE.ShaderPass(THREE.CopyShader);
  outputPass.renderToScreen = true;

  const hBlurPass = new THREE.ShaderPass(customHorizontalBlurShader);
  const vBlurPass = new THREE.ShaderPass(customVerticalBlurShader);
  vBlurPass.uniforms.targetColor.r = 0.0;
  vBlurPass.uniforms.targetColor.g = 1.0;
  vBlurPass.uniforms.targetColor.b = 1.0;
  vBlurPass.uniforms.targetColor.a = 1.0;

  const triBlurPass = new THREE.ShaderPass(customTriangleBlurShader, 'texture');

  //strength = 1.0, kernelSize = 25, sigma = 4.0, resolution = 256
  const bloomPass = new THREE.BloomPass(1.0, 25, 4.0, 256);
  bloomPass.renderToScreen = false;

  // composer.addPass(clearPass);
  // composer.addPass(sobelInputPass);
  // // composer.addPass(colorPass);
  // // composer.addPass(maskColorScene);
  // // composer.addPass(effectSobel);
  // // composer.addPass(clearMaskPass);
  // // composer.addPass(hBlurPass);
  // // composer.addPass(vBlurPass);
  // composer.addPass(triBlurPass);
  // composer.addPass(outputPass);

  // bloom on whole thing, need screen included in outline scene
  composer.addPass(clearPass);
  composer.addPass(colorPass);
  composer.addPass(sobelInputPass);
  composer.addPass(effectSobel);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  return { composer }
}

export default Composer;
