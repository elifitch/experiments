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
      });

      let goldTooth = meshGroup.children.find(mesh => mesh.name.includes('Teeth_Top.007')).clone();
      goldTooth.material = new THREE.MeshStandardMaterial({
        color: '#FFDB5D',
        roughness: 0.62,
        metalness: 1.0
      });
      goldTooth.material.opacity = 0; // just used as an identifier in the sobel shader

      meshGroup.remove(
        meshGroup.children.find(mesh => mesh.name.includes('Teeth_Top.007'))
      );
      
      meshGroup.add(goldTooth);
    
      resolve({ meshGroup: meshGroup });
    };
    const loadObj = () => objLoader.load(skull, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
