import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import 'three/MTLLoader';
import geometryHelpers from './geometry-helpers';
import donutObj from '../models/donut-procedural-sprinkles.obj';

// TODO
// See about removing collisions between particles
// Guarantee a pleasant distribution of sprinkle colors
// Guarantee a pleasant distribution of sprinkle sizes
// See about converting the random distribute function to use a seed so you can refresh till you find a distribution you like and then lock it to that seed

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const makeMat = (color) => new THREE.MeshBasicMaterial({ color });
const whiteMat = makeMat('#FFFFFF');
const blueMat = makeMat('#83E4E7');
const redMat = makeMat('#EB4962');
const yellowMat = makeMat('#FFE275');

const cakeMaterial = makeMat('#E8CDAA');
const icingMaterial = makeMat('#FE56FA');

const sprinkleMaterials = [whiteMat, blueMat, redMat, yellowMat];
const getRandomSprinkleMaterial = () => {
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  return sprinkleMaterials[getRandomInt(0, 3)];
};

function ImportModel(scene) {
  const loadingMgr = new THREE.LoadingManager();
  const objLoader = new THREE.OBJLoader2(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.error(err);

    const onObjLoad = loaderEvent => {
      const meshGroup = loaderEvent.detail.loaderRootNode;
      const cake = meshGroup.children[0];
      cake.material = cakeMaterial;
      const icing = meshGroup.children[1];
      icing.material = icingMaterial;
      const sprinkle = meshGroup.children[2];

      const sprinkleData = geometryHelpers.randomPointsInBufferGeometry(icing.geometry, 350);
      sprinkleData.forEach((d, i) => {
        const { position, normal } = d;
        const sprinkleClone = sprinkle.clone();
        sprinkleClone.material = getRandomSprinkleMaterial();

        sprinkleClone.rotation.y = Math.PI * Math.random();
        sprinkleClone.lookAt(normal);
        sprinkleClone.rotation.z = Math.PI * Math.random();

        sprinkleClone.position.set(position.x, position.y, position.z);

        sprinkleClone.scale.set(1, getRandomArbitrary(0.5, 0.8), 1);

        icing.add(sprinkleClone);
      });
      
      // remove original sprinkle
      meshGroup.remove(sprinkle)
      resolve(meshGroup);
    };

    const loadObj = () => objLoader.load(donutObj, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
