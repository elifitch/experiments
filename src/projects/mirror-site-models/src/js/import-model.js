import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import 'three/MTLLoader';
import models from '../models/eli-wtf-models.obj';
import { prepModels } from './prep-models';

function ImportModel() {
  const loadingMgr = new THREE.LoadingManager();
  const objLoader = new THREE.OBJLoader2(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.error(err);

    const onObjLoad = loaderEvent => resolve(prepModels(loaderEvent.detail.loaderRootNode));

    const loadObj = () => objLoader.load(models, onObjLoad, onLoaderProgress, onLoaderError);

    loadObj();
  });
}

export default ImportModel;
