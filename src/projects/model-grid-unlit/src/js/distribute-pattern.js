import * as THREE from 'three';

const getMac = (grp) => grp.children[0];
const getDonut = (grp) => grp.children[1];
const getSkull = (grp) => grp.children[2];

function distributePattern(meshGroup) {
  const middle = meshGroup;
  const middleMac = getMac(middle);
  const middleDonut = getDonut(middle);
  middleDonut.rotation.set(-Math.PI / 6, -Math.PI / 6, 0);
  const middleSkull = getSkull(middle);

  const top = meshGroup.clone();
  const topMac = getMac(top);
  const topDonut = getDonut(top);
  const topSkull = getSkull(top);

  const bottom = meshGroup.clone();
  const bottomMac = getMac(bottom);
  const bottomDonut = getDonut(bottom);
  const bottomSkull = getSkull(bottom);

  middleMac.position.set(-2, 0, 0);
  middleDonut.position.set(2, 0, 0);
  middleSkull.position.set(0, 0, 0);

  topMac.position.set(2, 2, 0);
  topDonut.position.set(0, 2, 0);
  topSkull.position.set(-2, 2, 0);

  bottomMac.position.set(0, -2, 0);
  bottomDonut.position.set(-2, -2, 0);
  bottomSkull.position.set(2, -2, 0);

  const result = new THREE.Object3D();
  result.add(middle);
  result.add(bottom);
  result.add(top);

  return result;
}

export default distributePattern;
