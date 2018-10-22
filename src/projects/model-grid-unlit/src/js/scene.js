import * as THREE from 'three';

function Scene({ cameraPos, cameraTarget, cameraFov, cameraAspect, cameraOverride }) {
  const scene = new THREE.Scene();
  const camera = cameraOverride || new THREE.PerspectiveCamera(cameraFov, cameraAspect, 1, 10000);
  camera.position.set(...cameraPos);
  const camTgt = cameraTarget ? new THREE.Vector3(...cameraTarget) : scene.position;
  camera.lookAt(camTgt);

  scene.add(camera);
  return { scene, camera };
}

export default Scene;
