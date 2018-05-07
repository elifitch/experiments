import * as THREE from 'three';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/shaders/ConvolutionShader';
import 'three/shaders/BlendShader';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/postprocessing/MaskPass';
import 'three/postprocessing/ClearPass';
import 'three/postprocessing/BloomPass';
import 'three/postprocessing/SavePass';
import SobelOperatorShader from './shaders/custom-sobel';
import customVerticalBlurShader from './shaders/custom-blur-v';
import customHorizontalBlurShader from './shaders/custom-blur-h';
import customTriangleBlurShader from './shaders/custom-triangle-blur';
import customBlendShader from './shaders/custom-blend';

function Composer({ renderer, camera, width, height, outlineScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    // format: THREE.RGBFormat,
    stencilBuffer: true, // THIS is also important!
    depthBuffer: true,
  }

  const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams);
  const composer = new THREE.EffectComposer(renderer, renderTarget);

  const clearPass = new THREE.ClearPass();

  const maskOutlineScene = new THREE.MaskPass(outlineScene, camera);
  maskOutlineScene.inverse = true;
  const clearMaskPass = new THREE.ClearMaskPass();

  const renderPass = new THREE.RenderPass(outlineScene, camera);
  renderPass.clear = false;
  renderPass.renderToScreen = false;

  const effectSobel = new THREE.ShaderPass(SobelOperatorShader);
  effectSobel.uniforms.resolution.value.x = width;
  effectSobel.uniforms.resolution.value.y = height;
  effectSobel.clear = false;
  effectSobel.renderToScreen = false;

  const outputPass = new THREE.ShaderPass(THREE.CopyShader);
  outputPass.renderToScreen = true;

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  composer.addPass(clearPass);
  composer.addPass(renderPass);
  composer.addPass(effectSobel);
  composer.addPass(outputPass);

  return { composer }
}

export default Composer;
