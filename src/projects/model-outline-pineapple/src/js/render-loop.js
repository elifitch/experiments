// import GifJS from 'gif.js';
// import GifWorker from 'gif.js/dist/gif.worker.js';

// const gif = new GifJS({
//   workers: 2,
//   quality: 10,
//   workerScript: GifWorker,
//   width: 1000,
//   height: 1000
// });
const duration = 2;
let tick = 0;

// function RenderOnControlChange({ renderer, composer, composer2, bloomPass, scene, camera, controls }) {
//   const render = () => {
//     composer.render();
//   };
//   render();
//   controls.addEventListener('change', render);
// }

function RenderLoop({ renderer, ctx, composer, scene, camera, controls, rotateMesh }) {
  tick++;

  controls.update();
  window.requestAnimationFrame(() => RenderLoop({ renderer, ctx, composer, scene, camera, controls, rotateMesh }));

  rotateMesh.rotation.y += ((Math.PI * 2) / (60 * duration));

  composer.render();
  // gif.addFrame(ctx, { copy: true });
  // // Finish gif
  // if(tick === duration * 60) {
  //   gif.on('finished', function (blob) {
  //     window.open(URL.createObjectURL(blob));
  //   });
  //   gif.render();
  // }
}

// export default RenderOnControlChange;
export default RenderLoop;