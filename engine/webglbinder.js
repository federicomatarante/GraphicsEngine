
/**
 * WebGLBinder Class
 * 
 * This class is responsible for binding various buffers, textures, and uniform values
 * to a WebGL shader program. It facilitates the interaction between the WebGL context
 * and the shader program by providing methods to bind vertex attributes, materials, 
 * textures, and lighting properties.
 * 
 * Usage:
 * 1. Create an instance of WebGLBinder with a WebGL shader program and context.
 * 2. Use the provided methods to bind vertex buffers, material properties, textures, 
 *    view matrices, and lighting properties before drawing objects.
 */
class WebGLBinder {
    /**
     * Constructor for the WebGLBinder class.
     * @param {WebGLProgram} program - The WebGL shader program.
     * @param {WebGLRenderingContext} gl - The WebGL rendering context.
     */
    constructor(program, gl) {
        this.program = program;
        this.gl = gl;
    }

    /**
     * Binds the positions buffer to the shader program.
     * @param {WebGLBuffer} positionsBuffer - The buffer containing vertex positions.
     */
    bindPositions(positionsBuffer) {
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        if (positionAttributeLocation === -1) { 
            console.error('Failed to get the storage location of a_position');
            return;
        }
        
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionsBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
    }

    /**
     * Binds the texture coordinates buffer to the shader program.
     * @param {WebGLBuffer} texCoordBuffer - The buffer containing texture coordinates.
     */
    bindTextureCoordinates(texCoordBuffer) {
        const texcoordAttributeLocation = this.gl.getAttribLocation(this.program, 'a_texcoord');
        if (texcoordAttributeLocation === -1) {
            console.error('Failed to get the storage location of a_texcoord');
            return;
        }
        
        this.gl.enableVertexAttribArray(texcoordAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        this.gl.vertexAttribPointer(texcoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    /**
     * Binds the normals buffer to the shader program.
     * @param {WebGLBuffer} normalBuffer - The buffer containing vertex normals.
     */
    bindNormals(normalBuffer) {
        const normalAttributeLocation = this.gl.getAttribLocation(this.program, 'a_normal');
        if (normalAttributeLocation === -1) {
            console.error('Failed to get the storage location of a_normal');
            return;
        }

        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
    }

    /**
    * Binds the material index buffer to the shader program.
    * @param {WebGLBuffer} materialIndexBuffer - The buffer containing material indices.
    */
    bindMaterialsIndices(materialIndexBuffer){
        // Get the location of the material index attribute in the shader
        const materialIndexLocation = this.gl.getAttribLocation(this.program, 'a_materialIndex');
        if (materialIndexLocation === -1) {
            console.error('Failed to get the storage location of a_materialIndex');
            return;
        }
        
        // Enable the material index attribute
        this.gl.enableVertexAttribArray(materialIndexLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, materialIndexBuffer);
        this.gl.vertexAttribPointer(materialIndexLocation, 1, this.gl.FLOAT, false, 0, 0);
    }

    /**
     * Binds the indices buffer to the shader program for indexed drawing.
     * @param {WebGLBuffer} indexBuffer - The buffer containing vertex indices.
     */
    bindIndices(indexBuffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }

    /**
    * Binds material properties (diffuse, specular, shininess, etc.) to the shader program.
    * @param {Object} material - The material properties object.
    * @param {number} i - The index of the material in the array.
    */
    #bindMaterial(material, i) {
        const gl = this.gl;
        const program = this.program;
    
        const uniformLocations = {
            Kd: gl.getUniformLocation(program, `uMaterials[${i}].Kd`),
            Ks: gl.getUniformLocation(program, `uMaterials[${i}].Ks`),
            Ns: gl.getUniformLocation(program, `uMaterials[${i}].Ns`),
            Ka: gl.getUniformLocation(program, `uMaterials[${i}].Ka`),
            illum: gl.getUniformLocation(program, `uMaterials[${i}].illum`),
            alpha: gl.getUniformLocation(program, `uMaterials[${i}].alpha`),
            transmissionFilter: gl.getUniformLocation(program, `uMaterials[${i}].transmissionFilter`),
            Ke: gl.getUniformLocation(program, `uMaterials[${i}].Ke`),
            Ni: gl.getUniformLocation(program, `uMaterials[${i}].Ni`),
            ambientTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].ambientTextureIndex`),
            diffuseTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].diffuseTextureIndex`),
            normalTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].normalTextureIndex`),
            specularTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].specularTextureIndex`),
            shininessTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].shininessTextureIndex`),
            emissionTextureIndex: gl.getUniformLocation(program, `uMaterials[${i}].emissionTextureIndex`),
        };
    
        for (const [key, location] of Object.entries(uniformLocations)) {
            if (location === null) {
                console.error(`Uniform location for '${key}' in 'uMaterials[${i}]' is not found.`);
            }
        }
    
        if (uniformLocations.Kd !== null) {
            gl.uniform3fv(uniformLocations.Kd, material.Kd);
        }

        if (uniformLocations.Ka !== null) {
            gl.uniform3fv(uniformLocations.Ka, material.Ka);
        }
        
        if (uniformLocations.Ks !== null) {
            gl.uniform3fv(uniformLocations.Ks, material.Ks);
        }
        if (uniformLocations.Ns !== null) {
            gl.uniform1f(uniformLocations.Ns, material.Ns);
        }
        if (uniformLocations.illum !== null) {
            gl.uniform1f(uniformLocations.illum, material.illum);
        }
        if (uniformLocations.alpha !== null) {
            gl.uniform1f(uniformLocations.alpha, material.alpha);
        }
        if (uniformLocations.Ni !== null) {
            gl.uniform1f(uniformLocations.Ni, material.Ni);
        }
        if (uniformLocations.transmissionFilter !== null) {
            gl.uniform3fv(uniformLocations.transmissionFilter, material.transmissionFilter);
        }
        if (uniformLocations.Ke !== null) {
            gl.uniform3fv(uniformLocations.Ke, material.Ke);
        }
        if (uniformLocations.ambientTextureIndex !== null) {
            gl.uniform1f(uniformLocations.ambientTextureIndex, material.ambientTexture);
        }
        if (uniformLocations.diffuseTextureIndex !== null) {
            gl.uniform1f(uniformLocations.diffuseTextureIndex, material.diffuseTexture);
        }
        if (uniformLocations.normalTextureIndex !== null) {
            gl.uniform1f(uniformLocations.normalTextureIndex, material.normalTexture);
        }
        if (uniformLocations.specularTextureIndex !== null) {
            gl.uniform1f(uniformLocations.specularTextureIndex, material.specularTexture);
        }
        if (uniformLocations.shininessTextureIndex !== null) {
            gl.uniform1f(uniformLocations.shininessTextureIndex, material.shininessTexture);
        }
        if (uniformLocations.emissionTextureIndex !== null) {
            gl.uniform1f(uniformLocations.emissionTextureIndex, material.emissionTexture);
        }
    }
    

    /**
     * Binds material properties (diffuse, specular, shininess) to the shader program.
     * @param {WebGLBuffer} materialBuffer - The buffer containing material properties.
     */
    bindMaterials(materials) {
        let i = 0;
        for(const material of materials){
            this.#bindMaterial(material,i);
            i += 1;
        }
    
    }
    
    /**
     * Initializes the array of partial textures in the shader.
     * @param {number} textureCount - The number of partial textures (max 13).
     * @description Initializes texture samplers for a given number of textures. Limits the count to 13.
     */
    initializePartialTextures(textureCount) {
        if(textureCount<=0) return;
        if (textureCount > 13) {
            console.warn('Maximum number of partial textures exceeded. Capping at 13.');
            textureCount = 13;
        }

        const samplerArrayLocation = this.gl.getUniformLocation(this.program, 'u_partial_textures');

        const samplerArray = new Int16Array(textureCount);

        for (let i = 0; i < textureCount; i++) {
            samplerArray[i] = i;
        }

        this.gl.uniform1iv(samplerArrayLocation, samplerArray);
    }

    /**
     * Binds a partial texture to the shader program.
     * @param {WebGLTexture} texture - The partial texture to be bound.
     * @param {number} index - The index of the partial texture (0-12).
     * @description Binds the texture to a specific texture unit and updates the shader uniform for that texture unit.
     */
    bindPartialTextures(texture, index) {
        const gl = this.gl;

        // Ensure index is within valid range
        if (index < 0 || index >= 13) {
            console.error('Invalid partial texture index. Must be between 0 and 12.');
            return;
            }

        // Bind the texture to the appropriate texture unit
        gl.activeTexture(gl.TEXTURE3 + index); 
        gl.bindTexture(gl.TEXTURE_2D,texture);  
        // Set the uniform to indicate which texture unit this texture is bound to
        const textureLocation = gl.getUniformLocation(this.program, `u_partial_textures[${index}]`);
        if (textureLocation) {
            gl.uniform1i(textureLocation, 3+index);
        } else {
            console.error(`Uniform location for 'u_partial_textures[${index}]' not found.`);
        }

    }

    /**
     * Binds the diffuse texture to the shader program.
     * @param {WebGLTexture} diffuseTexture - The texture to be used for diffuse mapping.
     * @param {Array} objectsColor - The fallback color if no texture is used.
     * @description If a diffuse texture is provided, binds it to the shader. Otherwise, sets a fallback color.
     */
    bindDiffuseTexture(diffuseTexture, objectsColor) {
        if (diffuseTexture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, diffuseTexture);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_texture'), 0);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_texture"), 1);
        } else {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_texture"), 0);
            const colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
            this.gl.uniform3fv(colorLocation, objectsColor);
        }
    }

    /**
     * Binds the normal texture to the shader program.
     * @param {WebGLTexture} normalTexture - The texture to be used for normal mapping.
     * @description Binds the normal texture to the shader if provided. Otherwise, disables normal mapping.
     */
    bindNormalTexture(normalTexture) {
        if (normalTexture) { 
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, normalTexture);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_normal_texture'), 1);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_normal_texture"), 1);
        } else {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_normal_texture"), 0);
        }
    }

    /**
     * Binds the specular texture to the shader program.
     * @param {WebGLTexture} specularTexture - The texture to be used for specular mapping.
     * @description Binds the specular texture to the shader if provided. Otherwise, disables specular mapping.
     */
    bindSpecularTexture(specularTexture) {
        if (specularTexture) {
            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, specularTexture);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_specular_texture'), 2);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_specular_texture"), 1);
        } else {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_specular_texture"), 0);
        }
    }

    /**
     * Binds the view matrices (projection, model-view, normal) to the shader program.
     * @param {TransformationMatrix} projectionMatrix - The projection matrix.
     * @param {TransformationMatrix} modelViewMatrix - The model-view matrix.
     * @param {TransformationMatrix} normalMatrix - The normal matrix.
     * @description Sets the view matrices for the shader program to handle transformations.
     */
    bindViewMatrices(projectionMatrix, modelViewMatrix, normalMatrix) {
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_projectionMatrix'), false, new Float32Array(projectionMatrix.elements));
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_modelViewMatrix'), false, new Float32Array(modelViewMatrix.elements));
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_normalMatrix'), false, new Float32Array(normalMatrix.elements));
    }

    /**
     * Binds the camera position to the shader program.
     * @param {Vector3D} cameraPosition - The position of the camera in 3D space.
     * @description Sets the camera position for the shader to calculate lighting effects.
     */
    bindCameraPosition(cameraPosition) {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_viewPos'), cameraPosition.elements);
    }

    /**
     * Binds lighting properties (position, color, ambient properties) to the shader program.
     * @param {Object} light - The light object containing lighting properties.
     * @param {Array} light.position - The position of the light in 3D space.
     * @param {Array} light.color - The color of the light.
     * @param {Object} light.ambient - The ambient light properties.
     * @param {Array} light.ambient.color - The ambient light color.
     * @param {Number} light.ambient.strength - The strength of the ambient light.
     * @param {Array} light.materialReflectivity.Ka - The ambient reflectivity of the material.
     * @description Sets the lighting parameters for the shader to compute light effects.
     */
    bindLight(light) {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_lightColor'), light.color);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_Ka'), light.materialReflectivity.Ka);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_ambientColor'), light.ambient.color);
        this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_ambientStrength'), light.ambient.strength);
    }
}
