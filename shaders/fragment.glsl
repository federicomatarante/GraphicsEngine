precision mediump float;

varying vec2 v_texcoord;          // Texture coordinates
varying vec3 v_normal;            // Normal interpolated from the vertex shader
varying vec3 v_fragPos;           // Fragment position in world space
varying vec3 v_Kd;                // Diffuse reflection coefficient
varying vec3 v_Ks;                // Specular reflection coefficient
varying float v_Ns;               // Specular reflection exponent
varying float v_illum;            // Illumination type
varying float v_diffuseTextureIndex;
varying float v_normalTextureIndex;
varying float v_specularTextureIndex;

uniform sampler2D u_texture;      // Diffuse map
uniform vec3 u_lightPos;          // Light position
uniform vec3 u_viewPos;           // Camera position
uniform vec3 u_lightColor;        // Light color
uniform vec3 u_Ka;                // Ambient reflection coefficient
uniform vec3 u_color;             // Material color (if not using texture)
uniform int u_has_texture;        // Flag to control whether to use the base texture

uniform sampler2D u_normal_texture;   // Normal map
uniform int u_has_normal_texture;     // Flag to control whether to use the normal map
uniform sampler2D u_specular_texture; // Specular map
uniform int u_has_specular_texture;   // Flag to control whether to use the specular map
uniform sampler2D u_partial_textures[13]; // Partial textures

// Function to get the texture based on the index
vec4 getTexture(float index, vec2 texcoord) {
    if (index == 0.0) {
        return texture2D(u_partial_textures[0], texcoord);
    } else if (index == 1.0) {
        return texture2D(u_partial_textures[1], texcoord);
    } else if (index == 2.0) {
        return texture2D(u_partial_textures[2], texcoord);
    } else if (index == 3.0) {
        return texture2D(u_partial_textures[3], texcoord);
    } else if (index == 4.0) {
        return texture2D(u_partial_textures[4], texcoord);
    } else if (index == 5.0) {
        return texture2D(u_partial_textures[5], texcoord);
    } else if (index == 6.0) {
        return texture2D(u_partial_textures[6], texcoord);
    } else if (index == 7.0) {
        return texture2D(u_partial_textures[7], texcoord);
    } else if (index == 8.0) {
        return texture2D(u_partial_textures[8], texcoord);
    } else if (index == 9.0) {
        return texture2D(u_partial_textures[9], texcoord);
    } else if (index == 10.0) {
        return texture2D(u_partial_textures[10], texcoord);
    } else if (index == 11.0) {
        return texture2D(u_partial_textures[11], texcoord);
    } else if (index == 12.0) {
        return texture2D(u_partial_textures[12], texcoord);
    } else {
        return vec4(1.0); // Default color if index is out of range
    }
}

void main() {
    // Ambient component: calculated as the product of the ambient coefficient and the light color
    vec3 ambient = u_Ka * u_lightColor;
    vec3 result = ambient;

    vec3 norm = normalize(v_normal);
    if (u_has_normal_texture == 1) {
        norm = normalize(texture2D(u_normal_texture, v_texcoord).rgb);
    } else if (v_normalTextureIndex >= 0.0) {
        norm = normalize(getTexture(v_normalTextureIndex, v_texcoord).rgb);
    }

    // Diffuse component: calculated as the maximum between the dot product of the normal and light direction, and 0
    vec3 lightDir = normalize(u_lightPos - v_fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = v_Kd * diff * u_lightColor;
    result += diffuse;

    if (v_illum > 1.0) {
        // Specular component (Blinn-Phong):
        // Compute the halfway vector, which is the vector halfway between the light direction and the view direction
        vec3 viewDir = normalize(u_viewPos - v_fragPos);
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(norm, halfwayDir), 0.0), v_Ns);
        vec3 specular = v_Ks * spec * u_lightColor;

        // Modify the specularity based on the specular map, if available
        if (u_has_specular_texture == 1) {
            vec3 specularMapValue = texture2D(u_specular_texture, v_texcoord).rgb;
            specular *= specularMapValue;
        } else if (v_specularTextureIndex >= 0.0) {
            vec3 specularMapValue = getTexture(v_specularTextureIndex, v_texcoord).rgb;
            specular *= specularMapValue;
        }
        result += specular;
    }

    // Apply the final color, using the texture if available
    vec4 texColor;
    if (u_has_texture != 0) {
        texColor = texture2D(u_texture, v_texcoord);
    } else if (v_diffuseTextureIndex >= 0.0) {
        texColor = getTexture(v_diffuseTextureIndex, v_texcoord);
    } else {
        texColor = vec4(u_color, 1.0);
    }
    gl_FragColor = vec4(result * texColor.rgb, 1.0);
}
