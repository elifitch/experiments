import * as THREE from 'three';
import mirrorMesh from './mirror-mesh';
import { makeSprinkles } from './make-sprinkles';

const basicMat = (color) => new THREE.MeshBasicMaterial({ color });

const skull = new THREE.Object3D();
skull.name = 'skull-container';
const mac = new THREE.Object3D();
mac.name = 'mac-container';
const donut = new THREE.Object3D();
donut.name = 'donut-container';
const megaphone = new THREE.Object3D();
megaphone.name = 'megaphone-container';

const megaphoneOffset = [
  [-0.001, 0, 0],
  [0, -0.0110, 0]
];
const meshConfig = {
  'skull-lenses': {
    material: basicMat('#004ee2'), // #619EE3
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },
  'skull-teeth': {
    // material: basicMat('#00ff96'), // #8AF5C5
    material: basicMat('#00ffbc'), // #8AF5C5
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },
  'skull-main': {
    material: basicMat('#ff1579'), // #FF5399
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },
  'skull-shades': {
    // material: basicMat('#2e2099'), // #513CA4
    material: basicMat('#402099'), // #513CA4
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },
  'skull-nose': {
    material: basicMat('#d91168'), // #E03F81
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },
  'skull-jaw': {
    material: basicMat('#f00068'),
    mirror: 'single',
    offset: null,
    container: skull,
    flipNormals: false
  },

  'donut-main': {
    material: basicMat('#E7CCAA'),
    mirror: 'single',
    offset: null,
    container: donut,
    flipNormals: false
  },
  'donut-icing': {
    material: basicMat('#FE56FA'),
    mirror: 'single',
    offset: null,
    container: donut,
    flipNormals: true
  },
  'donut-icing-sprinklezone': {
    material: basicMat('#FE56FA'),
    mirror: 'single',
    offset: null,
    container: donut,
    flipNormals: true
  },

  'megaphone-handle': {
    material: basicMat('#6E7173'),
    mirror: 'single',
    offset: null,
    container: megaphone,
    flipNormals: false
  },
  'megaphone-ridge': {
    material: basicMat('#6E7173'),
    mirror: 'double',
    offset: megaphoneOffset,
    container: megaphone,
    flipNormals: false
  },
  'megaphone-highlight': {
    material: basicMat('#FFF145'),
    mirror: 'double',
    offset: megaphoneOffset,
    container: megaphone,
    flipNormals: false
  },
  'megaphone-dark': {
    material: basicMat('#F4FCFF'),
    mirror: 'double',
    offset: megaphoneOffset,
    container: megaphone,
    flipNormals: false
  },
  'megaphone-light': {
    // material: basicMat('#00ff96'), // #8AF5C5
    material: basicMat('#00ffbc'), // #8AF5C5
    mirror: 'double',
    offset: megaphoneOffset,
    container: megaphone,
    flipNormals: false
  },

  'mac-main': {
    material: basicMat('#E7DFC9'),
    mirror: null,
    offset: null,
    container: mac,
    flipNormals: false
  },
  'mac-dark': {
    material: basicMat('#46433D'),
    mirror: null,
    offset: null,
    container: mac,
    flipNormals: false
  },
  'mac-medium': {
    material: basicMat('#D4CDB9'),
    mirror: null,
    offset: null,
    container: mac,
    flipNormals: false
  },
  'mac-screen': {
    material: basicMat('#74FFE5'),
    mirror: null,
    offset: null,
    container: mac,
    flipNormals: false
  }
};

function prepModels(meshGroup) {
  const result = new THREE.Object3D();

  Object.keys(meshConfig).forEach((meshName) => {
    const meshData = meshConfig[meshName];
    const mesh = meshGroup.getObjectByName(meshName);
    mesh.material = meshData.material;

    let nextMesh;
    if (meshData.mirror) {
      if (meshData.mirror === 'single') {
        nextMesh = mirrorMesh(mesh, false, null, meshData.flipNormals);
      }
      if (meshData.mirror === 'double') {
        const mirrorHoriz = mirrorMesh(mesh, false, meshData.offset[0], meshData.flipNormals);
        nextMesh = mirrorMesh(mirrorHoriz, true, meshData.offset[1], meshData.flipNormals);
      }
    } else {
      nextMesh = mesh.clone();
    }

    meshData.container.add(nextMesh);
  });

  makeSprinkles(
    donut.getObjectByName('donut-icing-sprinklezone'),
    meshGroup.getObjectByName('donut-sprinkle').clone()
  );

  skull.translateX(-0.07);
  skull.rotation.set(0, Math.PI * -0.15, 0);

  mac.translateX(-0.07);
  mac.rotation.set(Math.PI * 0.05, Math.PI * -0.15, 0);

  donut.translateX(0.1);
  donut.rotation.set(Math.PI * -0.1, Math.PI * 0.1, 0);

  megaphone.translateX(-0.3);
  megaphone.rotation.set(Math.PI * -0.1, Math.PI * 0.25, 0);

  // result.add(skull);
  // result.add(mac);
  // result.add(donut);
  result.add(megaphone);

  return result;
};

export { prepModels };
