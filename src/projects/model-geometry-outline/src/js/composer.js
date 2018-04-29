import * as THREE from 'three';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/postprocessing/MaskPass';
import 'three/postprocessing/ClearPass';
import SobelOperatorShader from './custom-sobel';

function Composer({ renderer, camera, width, height, outlineScene, colorScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    stencilBuffer: true, // THIS is also important!
  }

  const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams)
  const composer = new THREE.EffectComposer(renderer, renderTarget);

  const clearPass = new THREE.ClearPass()

  const maskColorScene = new THREE.MaskPass(colorScene, camera);
  maskColorScene.inverse = true;

  const clearMaskPass = new THREE.ClearMaskPass();

  const sobelInputPass = new THREE.RenderPass(outlineScene, camera);

  const colorSceneRenderPass = new THREE.RenderPass(colorScene, camera);
  colorSceneRenderPass.clear = false; // THIS IS IMPORTANT

  const effectSobel = new THREE.ShaderPass(SobelOperatorShader);
  effectSobel.uniforms.resolution.value.x = width;
  effectSobel.uniforms.resolution.value.y = height;

  const outputPass = new THREE.ShaderPass(THREE.CopyShader)
  outputPass.renderToScreen = true

  composer.addPass(clearPass);
  composer.addPass(sobelInputPass);
  composer.addPass(colorSceneRenderPass);
  composer.addPass(maskColorScene);
  composer.addPass(effectSobel);
  composer.addPass(clearMaskPass);
  composer.addPass(outputPass);

  return { composer, renderTarget }
}

export default Composer;
