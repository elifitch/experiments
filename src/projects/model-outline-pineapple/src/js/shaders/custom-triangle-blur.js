import triangleBlurShader from './triangle-blur-shader.glsl'
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Triangle blur shader
 * based on glfx.js triangle blur shader
 * https://github.com/evanw/glfx.js
 *
 * A basic blur filter, which convolves the image with a
 * pyramid filter. The pyramid filter is separable and is applied as two
 * perpendicular triangle filters.
 */

const deltaMagnitude = 0.1;
const customTriangleBlurShader = {

  uniforms: {

    "texture": { value: null },
    // "delta": { value: new THREE.Vector2(1, 1) }
    "delta": { value: new THREE.Vector2(deltaMagnitude, deltaMagnitude) }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: triangleBlurShader

};

export default customTriangleBlurShader;
