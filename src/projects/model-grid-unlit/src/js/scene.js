import * as THREE from 'three';

function Scene({cameraPos, cameraTarget, cameraFov, cameraAspect}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( cameraFov, cameraAspect, 1, 10000 );
  camera.position.set(...cameraPos);
  const camTgt = cameraTarget ? new THREE.Vector3(...cameraTarget) : scene.position;
  camera.lookAt(camTgt);
  
  // just to get some insanely basic lighting
  const hemiLight = new THREE.HemisphereLight('#cdf7f7', '#b7ae8f', 2)

  scene.add(camera);
  scene.add(hemiLight);
  return { scene, camera };
}

export default Scene;