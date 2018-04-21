import * as THREE from 'three';

function Renderer({containerEl, clearColor, alpha}) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha});
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  const w = containerEl.offsetWidth;
  const h = containerEl.offsetHeight;
  renderer.setSize(w, h);
  if (clearColor) {
    renderer.setClearColor(clearColor);
  }
  renderer.setPixelRatio(window.devicePixelRatio);
  containerEl.appendChild(renderer.domElement);
  return renderer;
}

export default Renderer;