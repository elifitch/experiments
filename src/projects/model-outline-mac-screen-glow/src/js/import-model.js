import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import model from '../models/macintosh-for-outline.obj';

function uniqueGrayscales(numColors) {
  const arrColors = [];
  for(let i = 1; i <= numColors; i++) {
    const color = (1 / numColors) * i;
    arrColors.push(new THREE.Color(color, color, color));
  }
  return arrColors;
}

function ImportModel() {
  const loadingMgr = new THREE.LoadingManager();
  const objLoader = new THREE.OBJLoader2(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    // objLoader.load(url, onLoad, onProgress, onError, onMeshAlter, useAsync)
    // objLoader.loadMtl(url, name, content, callbackOnLoad, crossOrigin)
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.error(err);
    const onObjLoad = loaderEvent => {
      const meshGroup = loaderEvent.detail.loaderRootNode;
      const uniqueColors = uniqueGrayscales(meshGroup.children.length);
      
      meshGroup.children.forEach((mesh, i) => {
        const color = uniqueColors[i];
        if (mesh.name !== 'screen_Cube.003') {
          mesh.material = new THREE.MeshBasicMaterial({ color });
        } else {
          // Using ff00ff as an itentifier, could also zero out alpha?
          mesh.material = new THREE.MeshBasicMaterial({ color: '#00FFFF' });
          mesh.material.opacity = 1.0;
        }
      });

      // let screen = meshGroup.children.find(getScreen).clone();
      let screen = meshGroup.getObjectByName('screen_Cube.003').clone();
      screen.material = new THREE.MeshBasicMaterial({
        color: '#00FFFF'
      });
      screen.material.opacity = 1.0; // just used as an identifier in the sobel shader

      const maskOutlineMesh = meshGroup.getObjectByName('screen-bezel_Cube.004').clone();
      maskOutlineMesh.material.side = THREE.DoubleSide;
    
      resolve({ meshGroup: meshGroup, colorModel: screen, maskOutlineMesh  });
    };
    const loadObj = () => objLoader.load(model, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
