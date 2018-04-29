import * as THREE from 'three';
import 'three/LoaderSupport';
import 'three/OBJLoader2';
// import 'three/OBJLoader';
// import 'three/JSONLoader';
import skull from '../models/chill-skull-v2--outline.obj';
import skullJson from '../models/chill-skull-v2--outline.js';

var THREEx = THREEx || {}
THREEx.dilateGeometry = function (geometry, length) {
  // gather vertexNormals from geometry.faces
  var vertexNormals = new Array(geometry.vertices.length);
  geometry.faces.forEach(function (face) {
    if (face instanceof THREE.Face4) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
      vertexNormals[face.d] = face.vertexNormals[3];
    } else if (face instanceof THREE.Face3) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
    } else console.assert(false);
  });
  // modify the vertices according to vertextNormal
  geometry.vertices.forEach(function (vertex, idx) {
    var vertexNormal = vertexNormals[idx];
    vertex.x += vertexNormal.x * length;
    vertex.y += vertexNormal.y * length;
    vertex.z += vertexNormal.z * length;
  });
};

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
  const objLoader = new THREE.JSONLoader(loadingMgr);
  objLoader.crossOrigin = '';

  return new Promise(resolve => {
    // objLoader.load(url, onLoad, onProgress, onError, onMeshAlter, useAsync)
    // objLoader.loadMtl(url, name, content, callbackOnLoad, crossOrigin)
    const onLoaderProgress = prog => console.log('proggy: ', prog);
    const onLoaderError = err => console.log(err);
    const onObjLoad = (geometry, material) => {
      // const meshGroup = loaderEvent.detail.loaderRootNode;
      const meshGroup = new THREE.Object3D;
      // const normalSkull = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
      const normalSkull = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
      meshGroup.add(normalSkull)

      const outlineSkullGeo = geometry.clone();
      THREEx.dilateGeometry(outlineSkullGeo, 0.01);
      const outlineSkull = new THREE.Mesh(outlineSkullGeo, new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.BackSide }));
      meshGroup.add(outlineSkull);

      // ////////////////////
      // const offset = 0.02;
      // const flipped = meshGroup.clone();
      // console.log(flipped)
      // // const flipped = meshGroup.children[meshGroup.children.length - 2];
      // flipped.material = new THREE.MeshBasicMaterial({ color: 0xFF00FF, side: THREE.BackSide });

      // // const geo = new THREE.Geometry().fromBufferGeometry(flipped.geometry);
      // const geo = flipped.geometry;
      // geo.computeFaceNormals();
      // geo.mergeVertices();
      // // geo.computeVertexNormals();
      // geo.computeVertexNormals();
      // flipped.geometry = new THREE.BufferGeometry().fromGeometry(geo);

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
        
      //   flippedNormals[i] = normalX * -1;
      //   flippedNormals[i + 1] = normalY * -1;
      //   flippedNormals[i + 2] = normalY * -1;
      // }
      // flippedVerts.needsUpdate = true;
      // console.log(flipped)
      // meshGroup.add(flipped)
      // ///////////////////

      resolve({ meshGroup });
    };
    const loadObj = () => objLoader.load(skullJson, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
