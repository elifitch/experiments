import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import model from '../models/pineapple-for-outline-split.obj';

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

      const leaves = meshGroup.getObjectByName('leaf_Plane').clone();
      leaves.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
      leaves.material.opacity = 0;
      meshGroup.remove(
        meshGroup.getObjectByName('leaf_Plane')
      );

      const uniqueColors = uniqueGrayscales(meshGroup.children.length);
      meshGroup.children.forEach((child, i) => {
        child.material = new THREE.MeshBasicMaterial({ color: uniqueColors[i] });
      });
      meshGroup.add(leaves);
    
      resolve({ meshGroup: meshGroup  });
    };
    const loadObj = () => objLoader.load(model, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
