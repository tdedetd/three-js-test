uniform float minY;
uniform float maxY;

uniform vec3 from;
uniform vec3 to;
varying vec3 vPosition;

void main() {
  vec3 color = mix(from, to, (vPosition.y - minY) / (maxY - minY));
  gl_FragColor = vec4(color, 1.0);
}
