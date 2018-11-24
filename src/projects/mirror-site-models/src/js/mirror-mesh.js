import * as THREE from 'three';

const mirrorGeometry = (geometry, mirrorVertical) => {
  const geo = geometry.clone();
  // X
  // geo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  // Y
  // geo.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  // Z
  // geo.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));

  // This flips the normals, and only works because we are only using basic materials
  // If we were to not use basic materials, this would be all fucked up
  if (mirrorVertical) {
    geo.scale(1, -1, 1);
  } else {
    geo.scale(-1, 1, 1);
  }

  return geo;
};

const getMirroredOffset = (offset) => offset.map(coord => coord / -2);
const getOriginalOffset = (offset) => offset.map(coord => coord / 2);

function mirrorMesh(original, mirrorVertical, offset, flipNormals) {
  const mirroredGeo = mirrorGeometry(original.geometry, mirrorVertical);
  const mirroredMesh = new THREE.Mesh(mirroredGeo, new THREE.MeshNormalMaterial());

  const originalStandardGeometry = new THREE.Geometry();
  const mirroredStandardGeometry = new THREE.Geometry();
  originalStandardGeometry.fromBufferGeometry(original.geometry);
  mirroredStandardGeometry.fromBufferGeometry(mirroredGeo);

  const mergedGeo = new THREE.Geometry();
  let originalMatrix = original.matrix;
  let mirroredMatrix = mirroredMesh.matrix;

  mirroredMesh.updateMatrix();
  if (offset && offset.length) {
    mirroredMatrix = mirroredMatrix.makeTranslation(...getMirroredOffset(offset));
    originalMatrix = originalMatrix.makeTranslation(...getOriginalOffset(offset));
  }

  if (flipNormals) {
    // stolen from https://stackoverflow.com/a/47093691
    var tmp;
    for (var f = 0; f < mirroredStandardGeometry.faces.length; f++) {
      tmp = mirroredStandardGeometry.faces[f].clone();
      mirroredStandardGeometry.faces[f].a = tmp.c;
      mirroredStandardGeometry.faces[f].c = tmp.a;
    }
  }

  mergedGeo.merge(mirroredStandardGeometry, mirroredMatrix);
  mergedGeo.merge(originalStandardGeometry, originalMatrix);

  const mergedBufferGeometry = new THREE.BufferGeometry();
  mergedBufferGeometry.fromGeometry(mergedGeo);

  const mergedMesh = new THREE.Mesh(mergedBufferGeometry, original.material);
  mergedMesh.name = original.name;
  mergedMesh.material.side = THREE.DoubleSide;

  return mergedMesh;
}

export default mirrorMesh;
