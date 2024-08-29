precision mediump float;

varying vec2 v_texcoord;          // Texture coordinates
varying vec3 v_normal;            // Normal interpolated from the vertex shader
varying vec3 v_fragPos;           // Fragment position in world space
varying vec3 v_Kd;                // Diffuse reflection coefficient
varying vec3 v_Ks;                // Specular reflection coefficient
varying float v_Ns;               // Specular reflection exponent

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

#define MAX_REFLECTION_DEPTH 2  // Maximum number of reflection bounces

// Function to calculate reflection using an iterative loop
vec3 traceReflection(vec3 origin, vec3 direction, vec3 normal) {
    vec3 reflectionColor = vec3(0.0);
    vec3 currentOrigin = origin;
    vec3 currentDirection = direction;
    vec3 currentNormal = normal;

    for (int i = 0; i < MAX_REFLECTION_DEPTH; i++) {
        // Calculate reflected direction
        vec3 reflectedDir = reflect(currentDirection, currentNormal);

        // Simulate intersection with a reflective plane
        float t = (dot(currentNormal, u_lightPos - currentOrigin)) / dot(currentNormal, reflectedDir);
        
        if (t > 0.0) {
            // Intersection point with the plane
            vec3 hitPoint = currentOrigin + reflectedDir * t;
            
            // Calculate reflected light (using only specular component for simplicity)
            vec3 hitNormal = normalize(v_normal);  // Use the normal at the intersection point
            vec3 lightDir = normalize(u_lightPos - hitPoint);
            float spec = pow(max(dot(hitNormal, lightDir), 0.0), v_Ns);
            
            reflectionColor += u_lightColor * spec * v_Ks;
            
            // Update origin and direction for the next bounce
            currentOrigin = hitPoint;
            currentDirection = reflectedDir;
            currentNormal = hitNormal;
        } else {
            break;  // Stop if no intersection occurs
        }
    }

    return reflectionColor;
}

void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    
    // Ambient component
    vec3 ambient = u_Ka * u_lightColor;
    
    // Perturb normal if normal map is available
    vec3 norm = normalize(v_normal);
    if (u_has_normal_texture == 1) {
        norm = normalize(texture2D(u_normal_texture, v_texcoord).rgb * 2.0 - 1.0);
    }

    // Diffuse component
    vec3 lightDir = normalize(u_lightPos - v_fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = v_Kd * diff * u_lightColor;

    // Specular component (Blinn-Phong)
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfwayDir), 0.0), v_Ns);
    vec3 specular = v_Ks * spec * u_lightColor;

    // Modify specularity based on the specular map, if available
    if (u_has_specular_texture == 1) {
        vec3 specularMapValue = texture2D(u_specular_texture, v_texcoord).rgb;
        specular *= specularMapValue;
    }
    
    // Add reflection using the iterative ray tracing method
    vec3 reflection = traceReflection(v_fragPos, viewDir, norm);

    // Combine the results (ambient, diffuse, specular, and reflection)
    vec3 result = ambient + diffuse + specular + reflection;

    // Apply the final color, using the texture if available
    if (u_has_texture == 0) {
        gl_FragColor = vec4(result * u_color, 1.0);  // If no texture, use the uniform color
    } else {
        gl_FragColor = vec4(result * texColor.rgb, 1.0);  // If a texture is present, modulate the final color with the texture
    }
}
