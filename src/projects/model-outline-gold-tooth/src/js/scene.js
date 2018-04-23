import * as THREE from 'three';

function Scene({cameraPos, cameraFov, cameraAspect}) {
  const outlineScene = new THREE.Scene();
  const colorScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( cameraFov, cameraAspect, 0.1, 10000 );
	camera.position.set(...cameraPos);
  camera.lookAt(outlineScene.position);
  
  // just to get some insanely basic lighting
  const pl1 = new THREE.PointLight({ color: '#FFFFFF' });
  const pl2 = new THREE.PointLight({ color: '#FFFFFF' });
  pl2.intensity = 0.3;
  const pl3 = new THREE.PointLight({ color: '#FFFFFF' });
  pl3.intensity = 0.01;
  pl1.position.set(0, 0, 100)
  pl2.position.set(100, 0, 0)
  pl3.position.set(-100, 0, 0)

  colorScene.add(pl1);
  colorScene.add(pl2);
  colorScene.add(pl3);

  // scene.add(camera);

  return { outlineScene, colorScene, camera };
}

export default Scene;