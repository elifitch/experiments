function RenderLoop({ renderer, rtTexture, scenes, cameras, controls }) {
  if (controls) {
    controls.update();
  }
  window.requestAnimationFrame(() => RenderLoop({ renderer, rtTexture, scenes, cameras, controls }));
  renderer.render(scenes[1], cameras[1]);
  renderer.render(scenes[0], cameras[0], rtTexture, true);
}

export default RenderLoop;
