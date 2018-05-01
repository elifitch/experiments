import sobelShader from './shaders/sobel-shader.glsl';
const SobelOperatorShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"resolution": { value: new THREE.Vector2() }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: sobelShader

};

export default SobelOperatorShader;
