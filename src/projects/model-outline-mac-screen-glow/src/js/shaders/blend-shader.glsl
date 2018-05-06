uniform float opacity;
uniform float mixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
varying vec2 vUv;

void main() {
  vec4 targetColor = vec4(0.0, 1.0, 1.0, 1.0);
  vec4 white = vec4(1.0);

  vec4 texel1 = texture2D( tDiffuse1, vUv );
  vec4 texel2 = texture2D( tDiffuse2, vUv );
  
  if (texel1 == white) {
    gl_FragColor = texel1;
  } else {
    gl_FragColor = opacity * mix( texel1, texel2, mixRatio );
  }
}