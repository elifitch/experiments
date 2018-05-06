import vBlurShader from './v-blur-shader.glsl'
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

const customVerticalBlurShader = {

  uniforms: {

    "tDiffuse": { value: null },
    // "v": { value: 1.0 / 512.0 },
    "v": { value: 0.1 / 512.0 },
    "targetColor": { value: new THREE.Vector4() }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: vBlurShader

};

export default customVerticalBlurShader;
