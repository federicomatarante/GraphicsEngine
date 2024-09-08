attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;
attribute float a_materialIndex;

uniform vec3 u_lightPos;               // Light position

uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_modelMatrix;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_fragPos;
varying float v_materialIndex;
varying vec3 v_lightDir;

void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    v_texcoord = a_texcoord;
    v_lightDir = u_lightPos - (u_modelMatrix * a_position).xyz;
    v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    v_fragPos = (u_modelViewMatrix * a_position).xyz;
    v_materialIndex = a_materialIndex;
}