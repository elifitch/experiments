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

function Composer({ renderer, camera, width, height, outlineScene, colorScene, maskScene }) {
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    // format: THREE.RGBAFormat,
    format: THREE.RGBFormat,
    stencilBuffer: true, // THIS is also important!
    depthBuffer: true,
  }

  const renderTarget = new THREE.WebGLRenderTarget(width, height, rtParams);
  const composer = new THREE.EffectComposer(renderer, renderTarget);

  const renderTargetScreen = new THREE.WebGLRenderTarget(width, height, rtParams);
  const composerScreen = new THREE.EffectComposer(renderer, renderTarget);


  const clearPass = new THREE.ClearPass();

  const maskColorScene = new THREE.MaskPass(colorScene, camera);
  maskColorScene.inverse = true;
  // const maskOutlineScene = new THREE.MaskPass(outlineScene, camera);
  const maskOutlineScene = new THREE.MaskPass(maskScene, camera);
  maskOutlineScene.inverse = true;
  const clearMaskPass = new THREE.ClearMaskPass();

  const sobelInputPass = new THREE.RenderPass(outlineScene, camera);
  sobelInputPass.clear = false;
  sobelInputPass.renderToScreen = false;

  const colorPass = new THREE.RenderPass(colorScene, camera);
  colorPass.clear = false; // Important, should be
  colorPass.renderToScreen = false;

  const renderMaskSceneForDebug = new THREE.RenderPass(maskScene, camera);
  renderMaskSceneForDebug.clear = false;
  renderMaskSceneForDebug.renderToScreen = false;

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
  const bloomPass = new THREE.BloomPass(3.0, 25, 4.0, 256);
  bloomPass.renderToScreen = false;

  const savePass = new THREE.SavePass(new THREE.WebGLRenderTarget(width, height, rtParams));

  // const blendWithScreen = new THREE.ShaderPass(THREE.BlendShader, 'tDiffuse1');
  const blendWithScreen = new THREE.ShaderPass(customBlendShader, 'tDiffuse1');
  blendWithScreen.uniforms['tDiffuse2'].value = savePass.renderTarget.texture;
  blendWithScreen.uniforms['mixRatio'].value = 0.5;



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
  // composer.addPass(clearPass);
  // composer.addPass(sobelInputPass);
  // composer.addPass(colorPass);
  // composer.addPass(effectSobel);
  // composer.addPass(bloomPass);
  // composer.addPass(outputPass);

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  // compose screen scene
  composerScreen.addPass(clearPass);
  // Without this mask you can see the screen through the outlined mac
  composerScreen.addPass(maskOutlineScene);
  composerScreen.addPass(colorPass);
  composerScreen.addPass(bloomPass);
  composerScreen.addPass(savePass);

  // compose outline scene
  composer.addPass(clearPass);
  composer.addPass(sobelInputPass);
  // composer.addPass(effectSobel);
  composer.addPass(blendWithScreen);
  composer.addPass(outputPass);

  return { composer, composer2: composerScreen, bloomPass }
}

export default Composer;
