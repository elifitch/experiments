import * as THREE from 'three';
import 'three/OrbitControls';
import 'three/postprocessing/EffectComposer';
import 'three/shaders/CopyShader';
import 'three/postprocessing/RenderPass';
import 'three/postprocessing/ShaderPass';
import 'three/postprocessing/MaskPass';
import 'three/postprocessing/ClearPass';
import SobelOperatorShader from './custom-sobel';

function Composer({ renderer, camera, width, height, outlineScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
  }

  const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams)
  const composer = new THREE.EffectComposer(renderer, renderTarget);

  const clearPass = new THREE.ClearPass()

  const clearMaskPass = new THREE.ClearMaskPass();

  const sobelInputPass = new THREE.RenderPass(outlineScene, camera);

  const effectSobel = new THREE.ShaderPass(SobelOperatorShader);
  effectSobel.uniforms.resolution.value.x = width;
  effectSobel.uniforms.resolution.value.y = height;
  effectSobel.renderToScreen = true;

  composer.addPass(sobelInputPass);
  composer.addPass(effectSobel);

  return { composer, renderTarget }
}

export default Composer;
