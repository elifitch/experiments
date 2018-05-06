function RenderLoop({renderer, scene, camera, controls}) {
  controls.update();
  window.requestAnimationFrame(() => RenderLoop({renderer, scene, camera, controls}));

  renderer.render();
}

function RenderOnControlChange({ renderer, scene, camera, controls }) {
  const render = () => renderer.render();
  render();
  controls.addEventListener('change', render);
}

export default RenderOnControlChange;