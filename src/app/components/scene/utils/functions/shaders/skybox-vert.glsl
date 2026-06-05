varying vec3 vPosition;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
