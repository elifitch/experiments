import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
import 'three/MTLLoader';
import sceneObj from '../models/eli-wtf-models.obj';
import donutTexture from '../models/icing-base-color.png';

const generateBasicMat = (color) => new THREE.MeshBasicMaterial({ color });
const donutMat = generateBasicMat('#E7CCAA');
const pinkMat = generateBasicMat('#FF5399');
const darkPinkMat = generateBasicMat('#E03F81');
const shadesMat = generateBasicMat('#8AE7CF');
const lensesMat = generateBasicMat('#60B2B4');
const teethMat = generateBasicMat('#D2B4F0');
const macMat = generateBasicMat('#E7DFC9');
const macShadeMat = generateBasicMat('#D4CDB9');
const macDarkMat = generateBasicMat('#46433D');
const screenMat = generateBasicMat('#74FFE5');

function ImportModel() {
  const loadingMgr = new THREE.LoadingManager();
  const objLoader = new THREE.OBJLoader2(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.error(err);
    const onObjLoad = loaderEvent => {
      const meshGroup = loaderEvent.detail.loaderRootNode;

      const donut = meshGroup.children[0];
      donut.name = 'donut';
      donut.material = donutMat;

      const icing = meshGroup.children[1];
      icing.name = 'icing';
      const icingTexture = new THREE.TextureLoader().load(donutTexture);
      icing.material = new THREE.MeshBasicMaterial({ map: icingTexture });

      const skullDark = meshGroup.children[2];
      skullDark.name = 'skullDark';
      skullDark.material = darkPinkMat;

      const lenses = meshGroup.children[3];
      lenses.name = 'lenses';
      lenses.material = lensesMat;

      const shades = meshGroup.children[4];
      shades.name = 'shades';
      shades.material = shadesMat;

      const skull = meshGroup.children[5];
      skull.name = 'skull';
      skull.material = pinkMat;

      const teeth = meshGroup.children[6];
      teeth.name = 'teeth';
      teeth.material = teethMat;

      const macDark = meshGroup.children[7];
      macDark.name = 'macDark';
      macDark.material = macDarkMat;

      const macMedium = meshGroup.children[8];
      macMedium.name = 'macMedium';
      macMedium.material = macShadeMat;

      const mac = meshGroup.children[9];
      mac.name = 'mac';
      mac.material = macMat;

      const screen = meshGroup.children[10];
      screen.name = 'screen';
      screen.material = screenMat;

      const macContainer = new THREE.Object3D();
      macContainer.add(mac);
      macContainer.add(macDark);
      macContainer.add(macMedium);
      macContainer.add(screen);

      const donutContainer = new THREE.Object3D();
      donutContainer.add(donut);
      donutContainer.add(icing);

      const skullContainer = new THREE.Object3D();
      skullContainer.add(skullDark);
      skullContainer.add(lenses);
      skullContainer.add(shades);
      skullContainer.add(skull);
      skullContainer.add(teeth);

      const groupContainer = new THREE.Object3D();
      groupContainer.add(macContainer);
      groupContainer.add(donutContainer);
      groupContainer.add(skullContainer);

      resolve(groupContainer);
    };
    const loadObj = () => objLoader.load(sceneObj, onObjLoad, onLoaderProgress, onLoaderError);

    loadObj();
  });
}

export default ImportModel;
