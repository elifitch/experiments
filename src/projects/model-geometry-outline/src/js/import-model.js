import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
// import 'three/OBJLoader';
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
    const onLoaderError = err => console.log(err);
    const onObjLoad = loaderEvent => {
      const meshGroup = loaderEvent.detail.loaderRootNode;
      console.log(meshGroup)
      const uniqueColors = uniqueGrayscales(meshGroup.children.length);
      
      const flippedMeshGroup = new THREE.Group();

      meshGroup.children.forEach((mesh, i) => {
        const color = uniqueColors[i];
        mesh.material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
        // mesh.material = new THREE.MeshNormalMaterial({ color });
      });

      // ////////////////////
      // const offset = 0.1;
      // // const flipped = meshGroup.children[0].clone();
      // const flipped = meshGroup.children[meshGroup.children.length - 2];
      // flipped.material = new THREE.MeshBasicMaterial({ color: 0xFF00FF })
      // const flippedVerts = flipped.geometry.attributes.position.array;
      // const flippedNormals = flipped.geometry.attributes.normal.array;
      // console.log(flippedVerts)
      // for (let i = 0; i < flippedVerts.length; i += 3) {
      //   const x = flippedVerts[i];
      //   const y = flippedVerts[i + 1];
      //   const z = flippedVerts[i + 2];
      //   const normalX = flippedNormals[i];
      //   const normalY = flippedNormals[i + 1];
      //   const normalZ = flippedNormals[i + 2];
        
      //   flippedVerts[i] = x + (normalX * offset)
      //   flippedVerts[i + 1] = y + (normalY * offset)
      //   flippedVerts[i + 2] = z + (normalY * offset)
      // }
      // flippedVerts.needsUpdate = true;
      // console.log(flipped)
      // ///////////////////
      ////////////////////
      const offset = 0.02;
      const flipped = meshGroup.children[meshGroup.children.length - 2].clone();
      console.log(flipped)
      // const flipped = meshGroup.children[meshGroup.children.length - 2];
      flipped.material = new THREE.MeshBasicMaterial({ color: 0xFF00FF });

      const geo = new THREE.Geometry().fromBufferGeometry(flipped.geometry);
      geo.computeFaceNormals();
      geo.mergeVertices();
      // geo.computeVertexNormals();
      geo.computeVertexNormals();
      flipped.geometry = new THREE.BufferGeometry().fromGeometry(geo);

      const flippedVerts = flipped.geometry.attributes.position.array;
      const flippedNormals = flipped.geometry.attributes.normal.array;
      console.log(flippedVerts)
      for (let i = 0; i < flippedVerts.length; i += 3) {
        const x = flippedVerts[i];
        const y = flippedVerts[i + 1];
        const z = flippedVerts[i + 2];
        const normalX = flippedNormals[i];
        const normalY = flippedNormals[i + 1];
        const normalZ = flippedNormals[i + 2];

        flippedVerts[i] = x + (normalX * offset)
        flippedVerts[i + 1] = y + (normalY * offset)
        flippedVerts[i + 2] = z + (normalY * offset)
        
        flippedNormals[i] = normalX * -1;
        flippedNormals[i + 1] = normalY * -1;
        flippedNormals[i + 2] = normalY * -1;
      }
      flippedVerts.needsUpdate = true;
      console.log(flipped)
      meshGroup.add(flipped)
      ///////////////////

      // meshGroup.children = meshGroup.children.filter(c => !c.name.includes('Teeth_Top.007'));
      meshGroup.children.find(mesh => mesh.name.includes('Teeth_Top.007')).material = new THREE.MeshBasicMaterial({
        color: 0xFF00FF
      });

      resolve({ meshGroup, flippedMeshGroup });
    };
    const loadObj = () => objLoader.load(skull, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
