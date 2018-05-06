import * as THREE from 'three';

function Renderer({containerEl, clearColor}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.autoClear = false;
  renderer.setClearColor(0xFF00FF, 0);
  const w = containerEl.offsetWidth;
  const h = containerEl.offsetHeight;
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  containerEl.appendChild(renderer.domElement);
  return renderer;
}

export default Renderer;