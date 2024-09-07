precision mediump float;
#define MAX_MATERIALS 50 // Example: Set a limit to the number of materials

struct Material {
    vec3 Kd;                   // Diffuse color
    vec3 Ks;                   // Specular color
    vec3 Ka;                   // Ambient color
    float Ns;                  // Shininess
    float illum;               // Illumination model
    float alpha;               // Opacity
    float Ni;
    vec3 transmissionFilter;   // Transmission filter
    vec3 Ke;                   // Emission color
    float ambientTextureIndex; // Index of ambient texture
    float diffuseTextureIndex; // Index of diffuse texture
    float normalTextureIndex;  // Index of normal texture
    float specularTextureIndex;// Index of specular texture
    float shininessTextureIndex;// Index of shininess texture
    float emissionTextureIndex;// Index of emission texture
};

uniform Material uMaterials[MAX_MATERIALS]; // Array of materials

varying vec2 v_texcoord;           // Texture coordinates
varying vec3 v_normal;             // Normal interpolated from the vertex shader
varying vec3 v_fragPos;            // Fragment position in world space
varying float v_materialIndex;     // Index of the material
varying vec3 v_lightDir; 
uniform sampler2D u_texture;           // Diffuse map
uniform vec3 u_viewPos;                // Camera position
uniform vec3 u_lightColor;             // Light color
uniform vec3 u_ambientColor;             // Light color
uniform int u_has_texture;             // Flag to control whether to use the base texture
uniform int u_invert_texture;           // Flat that says whether to invert y-axis in the texture coordinate system
uniform sampler2D u_normal_texture;    // Normal map
uniform int u_has_normal_texture;      // Flag to control whether to use the normal map
uniform sampler2D u_specular_texture;  // Specular map
uniform int u_has_specular_texture;    // Flag to control whether to use the specular map
uniform sampler2D u_partial_textures[13]; // Array of partial textures
uniform float u_ambientStrength;    // Strength of the ambient light

// Function to get the material based on the index
Material getMaterial(float index) {
    if (index == 0.0) {
        return uMaterials[0];
    } else if (index == 1.0) {
        return uMaterials[1];
    } else if (index == 2.0) {
        return uMaterials[2];
    } else if (index == 3.0) {
        return uMaterials[3];
    } else if (index == 4.0) {
        return uMaterials[4];
    } else if (index == 5.0) {
        return uMaterials[5];
    } else if (index == 6.0) {
        return uMaterials[6];
    } else if (index == 7.0) {
        return uMaterials[7];
    } else if (index == 8.0) {
        return uMaterials[8];
    } else if (index == 9.0) {
        return uMaterials[9];
    } else if (index == 10.0) {
        return uMaterials[10];
    } else if (index == 11.0) {
        return uMaterials[11];
    } else if (index == 12.0) {
        return uMaterials[12];
    } else if (index == 13.0) {
        return uMaterials[13];
    } else if (index == 14.0) {
        return uMaterials[14];
    } else if (index == 15.0) {
        return uMaterials[15];
    } else if (index == 16.0) {
        return uMaterials[16];
    } else if (index == 17.0) {
        return uMaterials[17];
    } else if (index == 18.0) {
        return uMaterials[18];
    } else if (index == 19.0) {
        return uMaterials[19];
    } else if (index == 20.0) {
        return uMaterials[20];
    } else if (index == 21.0) {
        return uMaterials[21];
    } else if (index == 22.0) {
        return uMaterials[22];
    } else if (index == 23.0) {
        return uMaterials[23];
    } else if (index == 24.0) {
        return uMaterials[24];
    } else if (index == 25.0) {
        return uMaterials[25];
    } else if (index == 26.0) {
        return uMaterials[26];
    } else if (index == 27.0) {
        return uMaterials[27];
    } else if (index == 28.0) {
        return uMaterials[28];
    } else if (index == 29.0) {
        return uMaterials[29];
    } else if (index == 30.0) {
        return uMaterials[30];
    } else if (index == 31.0) {
        return uMaterials[31];
    } else if (index == 32.0) {
        return uMaterials[32];
    } else if (index == 33.0) {
        return uMaterials[33];
    } else if (index == 34.0) {
        return uMaterials[34];
    } else if (index == 35.0) {
        return uMaterials[35];
    } else if (index == 36.0) {
        return uMaterials[36];
    } else if (index == 37.0) {
        return uMaterials[37];
    } else if (index == 38.0) {
        return uMaterials[38];
    } else if (index == 39.0) {
        return uMaterials[39];
    } else if (index == 40.0) {
        return uMaterials[40];
    } else if (index == 41.0) {
        return uMaterials[41];
    } else if (index == 42.0) {
        return uMaterials[42];
    } else if (index == 43.0) {
        return uMaterials[43];
    } else if (index == 44.0) {
        return uMaterials[44];
    } else if (index == 45.0) {
        return uMaterials[45];
    } else if (index == 46.0) {
        return uMaterials[46];
    } else if (index == 47.0) {
        return uMaterials[47];
    } else if (index == 48.0) {
        return uMaterials[48];
    } else if (index == 49.0) {
        return uMaterials[49];
    } else {
        return uMaterials[0]; // Default material if index is out of range
    }
}

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
    Material mat = getMaterial(v_materialIndex);
    vec2 texCoord;
    if(u_invert_texture==1){
        texCoord = vec2(v_texcoord.x,1.0-v_texcoord.y);
    } else {
        texCoord = v_texcoord;
    }
    
    // Apply the color, using the texture if available
    vec4 color = vec4(mat.Kd, 1.0);
    if (mat.diffuseTextureIndex != -1.0) {
        vec4 texColor = getTexture(mat.diffuseTextureIndex, texCoord);
        color = color * texColor;
    } else if (u_has_texture != 0) {
        vec4 texColor = texture2D(u_texture, texCoord);
        color = color * texColor;
    }

    float alpha = color.a * mat.alpha;
    if(mat.illum == 0.0){
        gl_FragColor = vec4(color.rgb, alpha);
        return;
    }
    
    vec3 ambient = mat.Ka * u_ambientColor * u_ambientStrength;
    if (mat.ambientTextureIndex != -1.0) {
        vec3 ambientMapValue = getTexture(mat.ambientTextureIndex, texCoord).rgb;
        ambient = ambient * ambientMapValue;
    }

    if(mat.illum == 1.0){
        gl_FragColor = vec4(ambient * color.rgb, alpha);
        return;
    }

    vec3 result = ambient;

    // Calculate the normal
    vec3 norm = normalize(v_normal);
    if (mat.normalTextureIndex >= 0.0) {
        norm = normalize(getTexture(mat.normalTextureIndex, texCoord).rgb * 2.0 - 1.0);
    } else if (u_has_normal_texture == 1) {
        norm = normalize(texture2D(u_normal_texture, texCoord).rgb * 2.0 - 1.0);
    }


    // Diffuse component
    vec3 lightDir = normalize(v_lightDir);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = mat.Kd * diff * u_lightColor;
    result += diffuse;

    // Determine shininess
    float Ns = mat.Ns;
    if (mat.shininessTextureIndex != -1.0) {
        Ns = Ns * getTexture(mat.shininessTextureIndex, texCoord).r;
    }

    // Calculate the refraction based on the index of refraction Ni
    vec3 viewDir = normalize(u_viewPos - v_fragPos);

    // Specular component (Blinn-Phong)
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfwayDir), 0.0), Ns);
    vec3 Ks = mat.Ks;
    if (mat.specularTextureIndex >= 0.0) {
        vec3 specularMapValue = getTexture(mat.specularTextureIndex, texCoord).rgb;
        Ks = Ks * specularMapValue;
    } else if (u_has_specular_texture == 1) {
        
        vec3 specularMapValue = texture2D(u_specular_texture, texCoord).rgb;
        Ks = Ks * specularMapValue;
    }
    vec3 specular = Ks * spec * u_lightColor;
    result += specular;

    // Emission component
    vec3 Ke = mat.Ke;
    if (mat.emissionTextureIndex != -1.0) {
        Ke = getTexture(mat.emissionTextureIndex, texCoord).rgb;
    }
    result += Ke;

    // Apply transmission filter
    result = result * mat.transmissionFilter;

    
    gl_FragColor = vec4(result * color.rgb, alpha);
}