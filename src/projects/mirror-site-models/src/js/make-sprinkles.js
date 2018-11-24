import * as THREE from 'three';
import { randomPointsInBufferGeometry } from './geometry-helpers';

const SPRINKLE_OFFSET = 0.006;
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const basicMat = (color) => new THREE.MeshBasicMaterial({ color });
const whiteMat = basicMat('#FFFFFF');
const blueMat = basicMat('#83E4E7');
// const redMat = basicMat('#EB4962');
const redMat = basicMat('#ff1579');
const yellowMat = basicMat('#FFE275');
const sprinkleMaterials = [whiteMat, blueMat, redMat, yellowMat];

const getRandomSprinkleMaterial = () => {
  return sprinkleMaterials[getRandomInt(0, 3)];
};

function makeSprinkles(icingMesh, sprinkleMesh) {
  // This is an imperative function, modifies original donut object
  const sprinkleData = randomPointsInBufferGeometry(icingMesh.geometry, 240);
  sprinkleData.forEach((d, i) => {
    const { position, normal } = d;

    const sprinkleClone = sprinkleMesh.clone();
    sprinkleClone.material = getRandomSprinkleMaterial();

    sprinkleClone.rotation.y = Math.PI * Math.random();
    sprinkleClone.lookAt(normal);
    sprinkleClone.rotation.z = Math.PI * Math.random();

    sprinkleClone.position.set(position.x, position.y, position.z);
    sprinkleClone.translateZ(SPRINKLE_OFFSET);

    sprinkleClone.scale.set(1, getRandomArbitrary(0.5, 0.8), 1);

    icingMesh.add(sprinkleClone);
  });
};

export { makeSprinkles };
