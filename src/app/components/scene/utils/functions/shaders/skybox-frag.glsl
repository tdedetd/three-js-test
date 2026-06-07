uniform float minY;
uniform float maxY;
uniform vec3 from;
uniform vec3 to;

varying vec3 vPosition;

void main() {
  float mixValue = (vPosition.y - minY) / (maxY - minY);
  vec3 color = mix(
    from,
    to,
    mixValue < 0.5 ? 0.0 : (mixValue - 0.5) * 2.0
  );
  gl_FragColor = vec4(color, 1.0);
}
