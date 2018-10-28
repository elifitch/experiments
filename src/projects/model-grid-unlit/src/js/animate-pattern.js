import * as THREE from 'three';

function animatePattern({ pattern, mouseCoords, dimensions }) {
  const horizontalMidpoint = dimensions.w / 2;
  const verticalMidpoint = dimensions.h / 2;
  pattern.children.forEach(group => {
    group.children.forEach(meshContainer => {
      // meshContainer.rotation.set(mouseCoords.y / 100, mouseCoords.x / 100, 0)
      const vec = meshContainer.rotation.toVector3();
    });
  });
}

export default animatePattern;
