import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import skull from '../models/chill-skull-v2--outline.obj';

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
        mesh.material = new THREE.MeshBasicMaterial({ color });
        // mesh.material = new THREE.MeshNormalMaterial({ color });
      })
      resolve(meshGroup);
    };
    const loadObj = () => objLoader.load(skull, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
