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
      const normalSkull = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));

      const outlineSkullGeo = geometry.clone();
      outlineSkullGeo.computeVertexNormals();
      THREEx.dilateGeometry(outlineSkullGeo, 0.02);
      const outlineSkull = new THREE.Mesh(outlineSkullGeo, new THREE.MeshNormalMaterial({ color: 0xFF0000, flatShading: false }));

      resolve({ normalSkull, outlineSkull });
    };
    const loadObj = () => objLoader.load(skullJson, onObjLoad, onLoaderProgress, onLoaderError);
    loadObj();
  });
}

export default ImportModel;
