// uniform sampler2D tDiffuse;
// uniform float h;
// varying vec2 vUv;

// void main() {
//   vec4 sum = vec4( 0.0 );
//   sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
//   sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
//   sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
//   sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
//   sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
//   sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
//   sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
//   sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
//   sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

//   gl_FragColor = sum;
// }


uniform sampler2D tDiffuse;
uniform float h;
uniform vec4 targetColor;
varying vec2 vUv;

void main() {
  vec4 sum = vec4( 0.0 );
  vec4 targetColor = vec4(0.0, 1.0, 1.0, 1.0);

  vec4 texel1 = texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) );
  vec4 texel2 = texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) );
  vec4 texel3 = texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) );
  vec4 texel4 = texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) );
  vec4 texel5 = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );
  vec4 texel6 = texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) );
  vec4 texel7 = texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) );
  vec4 texel8 = texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) );
  vec4 texel9 = texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) );

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
