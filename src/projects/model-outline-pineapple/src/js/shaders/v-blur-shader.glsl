// uniform sampler2D tDiffuse;
// uniform float v;
// varying vec2 vUv;

// void main() {
//   vec4 sum = vec4( 0.0 );
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;
  
//   gl_FragColor = sum;
// }

uniform sampler2D tDiffuse;
uniform float v;
uniform vec4 targetColor;
varying vec2 vUv;

void main() {
  vec4 sum = vec4( 0.0 );
  vec4 targetColor = vec4(0.0, 1.0, 1.0, 1.0);

  vec4 texel1 = texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) );
  vec4 texel2 = texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) );
  vec4 texel3 = texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) );
  vec4 texel4 = texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) );
  vec4 texel5 = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );
  vec4 texel6 = texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) );
  vec4 texel7 = texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) );
  vec4 texel8 = texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) );
  vec4 texel9 = texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) );

  if (
    texel1 == targetColor ||
    texel2 == targetColor ||
    texel3 == targetColor ||
    texel4 == targetColor ||
    texel5 == targetColor ||
    texel6 == targetColor ||
    texel7 == targetColor ||
    texel8 == targetColor ||
    texel9 == targetColor
  ) {
    sum += texel1 * 0.051;
    sum += texel2 * 0.0918;
    sum += texel3 * 0.12245;
    sum += texel4 * 0.1531;
    sum += texel5 * 0.1633;
    sum += texel6 * 0.1531;
    sum += texel7 * 0.12245;
    sum += texel8 * 0.0918;
    sum += texel9 * 0.051;
  } else {
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );
  }

  gl_FragColor = sum;
}