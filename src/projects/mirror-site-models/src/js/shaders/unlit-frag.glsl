uniform vec3 color;

void main() {
  // gl_FragColor = vec4(2.0, 0.0, 2.0, 2.0);
  gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}