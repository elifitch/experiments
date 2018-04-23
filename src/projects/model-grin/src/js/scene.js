import * as THREE from 'three';

function Scene({cameraPos, cameraFov, cameraAspect}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( cameraFov, cameraAspect, 0.1, 10000 );
	camera.position.set(...cameraPos);
  camera.lookAt(scene.position);
  
  // just to get some insanely basic lighting
  // const hemiLight = new THREE.HemisphereLight('#b7ae8f', '#cdf7f7', 2)
  const pl1 = new THREE.PointLight({ color: '#FFFFFF' });
  const pl2 = new THREE.PointLight({ color: '#FFFFFF' });
  pl2.intensity = 0.3;
  const pl3 = new THREE.PointLight({ color: '#FFFFFF' });
  pl3.intensity = 0.01;
  pl1.position.set(0, 0, 100)
  pl2.position.set(100, 0, 0)
  pl3.position.set(-100, 0, 0)

  scene.add(camera);
  scene.add(pl1);
  scene.add(pl2);
  scene.add(pl3);
  return { scene, camera };
}

export default Scene;