precision mediump float;

varying vec2 v_texcoord;          // Texture coordinates
varying vec3 v_normal;            // Normal interpolated from the vertex shader
varying vec3 v_fragPos;           // Fragment position in world space
varying vec3 v_Kd;                // Diffuse reflection coefficient
varying vec3 v_Ks;                // Specular reflection coefficient
varying float v_Ns;               // Specular reflection exponent
varying float v_illum;            // Illumination type

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

void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    
    // Ambient component: calculated as the product of the ambient coefficient and the light color
    vec3 ambient = u_Ka * u_lightColor;
    vec3 result = ambient;

    if(v_illum>0.0){
            // Perturb the normal with the normal map, if available
        vec3 norm = normalize(v_normal);
        if (u_has_normal_texture == 1) {
            norm = normalize(texture2D(u_normal_texture, v_texcoord).rgb);
        }

        // Diffuse component: calculated as the maximum between the dot product of the normal and light direction, and 0
        vec3 lightDir = normalize(u_lightPos - v_fragPos);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = v_Kd * diff * u_lightColor;
        result += diffuse;

        if(v_illum>1.0){
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
            }
            result += specular;
        }
    }
    
    

    // Apply the final color, using the texture if available
    if (u_has_texture == 0) {
        gl_FragColor = vec4(u_color, 1.0);  // If there's no texture, use the uniform color
    } else {
        gl_FragColor = vec4(result * texColor.rgb, 1.0);  // If there's a texture, modulate the final color with the texture
    }
}
