import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import 'three/MTLLoader';
import skullObj from '../models/eli-wtf-models-skull-mirror.obj';

const mirrorGeometry = (geometry) => {
  const geo = geometry.clone();
  // X
  // geo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  // Y
  // geo.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  // Z
  // geo.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));

  // This flips the normals, and only works because we are only using basic materials
  // If we were to not use basic materials, this would be all fucked up
  geo.scale(-1, 1, 1);

  return geo;
};

function ImportModel() {
  const loadingMgr = new THREE.LoadingManager();
  const objLoader = new THREE.OBJLoader2(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.error(err);
    const onObjLoad = loaderEvent => {
      const meshGroup = loaderEvent.detail.loaderRootNode;

      const original = meshGroup.children[0];

      const mirroredGeo = mirrorGeometry(original.geometry);
      const mirroredMesh = new THREE.Mesh(mirroredGeo, new THREE.MeshNormalMaterial());

      const originalStandardGeometry = new THREE.Geometry();
      const mirroredStandardGeometry = new THREE.Geometry();
      originalStandardGeometry.fromBufferGeometry(original.geometry);
      mirroredStandardGeometry.fromBufferGeometry(mirroredGeo);

      const mergedGeo = new THREE.Geometry();

      mirroredMesh.updateMatrix();
      mergedGeo.merge(mirroredStandardGeometry, mirroredMesh.matrix);
      mergedGeo.merge(originalStandardGeometry, original.matrix);

      const mergedBufferGeometry = new THREE.BufferGeometry();
      mergedBufferGeometry.fromGeometry(mergedGeo);

      const mergedMesh = new THREE.Mesh(mergedBufferGeometry, new THREE.MeshNormalMaterial());
      mergedMesh.material.side = THREE.DoubleSide;

      console.log(mergedMesh);

      resolve(mergedMesh);
    };
    const loadObj = () => objLoader.load(skullObj, onObjLoad, onLoaderProgress, onLoaderError);

    loadObj();
  });
}

export default ImportModel;
