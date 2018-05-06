import blendShader from './blend-shader.glsl';

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Blend two textures
 */

const customBlendShader = {

  uniforms: {

    "tDiffuse1": { value: null },
    "tDiffuse2": { value: null },
    "mixRatio": { value: 0.5 },
    "opacity": { value: 1.0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: blendShader

};

export default customBlendShader;
