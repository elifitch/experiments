function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// function RenderLoop({renderer, scene, camera, controls}) {
//   controls.update();
//   window.requestAnimationFrame(() => RenderLoop({renderer, scene, camera, controls}));

//   renderer.render();
// }
function RenderOnControlChange({ renderer, composer, composer2, bloomPass, scene, camera, controls }) {
  const render = () => {
    bloomPass.copyUniforms.opacity.value = getRandomFloat(0.9, 1.1) * 4.0;
    composer2.render();
    composer.render();
  };
  render();
  controls.addEventListener('change', render);
}

function RenderLoop({ renderer, composer, composer2, bloomPass, scene, camera, controls }) {
  controls.update();
  window.requestAnimationFrame(() => RenderLoop({ renderer, composer, composer2, bloomPass, scene, camera, controls }));

  bloomPass.copyUniforms.opacity.value = getRandomFloat(0.7, 1.3) * 3.0;
  composer2.render();
  composer.render();
}

// export default RenderOnControlChange;
export default RenderLoop;