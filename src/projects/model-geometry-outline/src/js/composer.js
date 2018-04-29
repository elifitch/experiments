import * as THREE from 'three';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/postprocessing/MaskPass';
import 'three/postprocessing/ClearPass';
import SobelOperatorShader from './custom-sobel';

function Composer({ renderer, camera, width, height, outlineScene, innerScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    stencilBuffer: true, // THIS is also important!
  }
  
  const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams)
  const composer = new THREE.EffectComposer(renderer, renderTarget);

  const innerPass = new THREE.RenderPass(innerScene, camera);
  const outlinePass = new THREE.RenderPass(outlineScene, camera);
  outlinePass.clear = false;

  const maskPass = new THREE.MaskPass(innerScene, camera);
  maskPass.inverse = true;
  const clearMask = new THREE.ClearMaskPass();
  
  const copyPass = new THREE.ShaderPass(THREE.CopyShader);
  copyPass.renderToScreen = true;

  composer.addPass(innerPass);
  composer.addPass(maskPass);
  composer.addPass(outlinePass);
  composer.addPass(clearMask);
  composer.addPass(copyPass);

  return { composer, renderTarget }
}

export default Composer;
