uniform sampler2D tDiffuse;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec3 result = vec3( 0 );
  vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

  // kernel definition (in glsl matrices are filled in column-major order)

  const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kern
  const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kern

  // fetch the 3x3 neighbourhood of a fragment

  // first column

  float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
  float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
  float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;

  // second column

  float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
  vec4 middleTexel = texture2D(tDiffuse, vUv + texel * vec2(0, 0));
  // float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
  float tx1y1 = middleTexel.r;
  float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;

  // third column

  float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
  float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
  float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;

  // gradient value in x direction

  float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 + 
    Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 + 
    Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2; 

  // gradient value in y direction

  float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 + 
    Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 + 
    Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2; 

  // magnitute of the total gradient

  float G = sqrt( pow(valueGx, 6.0) + pow(valueGy, 6.0) );
  
  if( G > 0.0 ) result = vec3(1);
  // if( middleTexel.r != middleTexel.g ) result = vec3( 0 );
  if (middleTexel.a == 0.0) result = vec3(middleTexel);
  if (middleTexel.r == 1.0 && middleTexel.g == 1.0 && middleTexel.b == 1.0) result = vec3(0);
  
  gl_FragColor = vec4( result, 1 );

}