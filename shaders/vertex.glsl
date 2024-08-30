attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

attribute vec3 a_Kd;
attribute vec3 a_Ks;
attribute float a_Ns;
attribute float a_illum;
attribute float a_diffuseTextureIndex;
attribute float a_normalTextureIndex;
attribute float a_specularTextureIndex;


uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalMatrix;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_fragPos;
varying vec3 v_Kd;
varying vec3 v_Ks;
varying float v_Ns;
varying float v_illum;    
varying float v_diffuseTextureIndex;
varying float v_normalTextureIndex;
varying float v_specularTextureIndex;

void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    v_texcoord = a_texcoord;
    v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    v_fragPos = (u_modelViewMatrix * a_position).xyz;
    v_Kd = a_Kd;
    v_Ks = a_Ks;
    v_Ns = a_Ns;
    v_illum = a_illum;
    v_diffuseTextureIndex = a_diffuseTextureIndex;
    v_normalTextureIndex = a_normalTextureIndex;
    v_specularTextureIndex = a_specularTextureIndex;
}