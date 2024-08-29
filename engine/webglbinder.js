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
     * Binds the indices buffer to the shader program for indexed drawing.
     * @param {WebGLBuffer} indexBuffer - The buffer containing vertex indices.
     */
    bindIndices(indexBuffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }

    /**
     * Binds material properties (diffuse, specular, shininess) to the shader program.
     * @param {WebGLBuffer} materialBuffer - The buffer containing material properties.
     */
    bindMaterials(materialBuffer) {
        const KdAttributeLocation = this.gl.getAttribLocation(this.program, 'a_Kd');
        const KsAttributeLocation = this.gl.getAttribLocation(this.program, 'a_Ks');
        const NsAttributeLocation = this.gl.getAttribLocation(this.program, 'a_Ns');
        const illumAttributeLocation = this.gl.getAttribLocation(this.program, 'a_illum');
    
        if (KdAttributeLocation === -1 || KsAttributeLocation === -1 || NsAttributeLocation === -1 || illumAttributeLocation === -1) {
            console.error('Failed to get the storage location of material attributes');
            return;
        }
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, materialBuffer);
    
        // Stride is now 32 bytes (8 floats * 4 bytes per float)
        const stride = 32;
    
        this.gl.enableVertexAttribArray(KdAttributeLocation);
        this.gl.vertexAttribPointer(KdAttributeLocation, 3, this.gl.FLOAT, false, stride, 0);
    
        this.gl.enableVertexAttribArray(KsAttributeLocation);
        this.gl.vertexAttribPointer(KsAttributeLocation, 3, this.gl.FLOAT, false, stride, 12);
    
        this.gl.enableVertexAttribArray(NsAttributeLocation);
        this.gl.vertexAttribPointer(NsAttributeLocation, 1, this.gl.FLOAT, false, stride, 24);
    
        this.gl.enableVertexAttribArray(illumAttributeLocation);
        this.gl.vertexAttribPointer(illumAttributeLocation, 1, this.gl.FLOAT, false, stride, 28);
    }

    /**
     * Binds the diffuse texture to the shader program.
     * @param {WebGLTexture} diffuseTexture - The texture to be used for diffuse mapping.
     * @param {Array} objectsColor - The fallback color if no texture is used.
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
     */
    bindNormalTexture(normalTexture) {
        if (normalTexture) { 
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, normalTexture);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_normal_texture'), 0);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_normal_texture"), 1);
        } else {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_has_normal_texture"), 0);
        }
    }

    /**
     * Binds the specular texture to the shader program.
     * @param {WebGLTexture} specularTexture - The texture to be used for specular mapping.
     */
    bindSpecularTexture(specularTexture) {
        if (specularTexture) {
            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, specularTexture);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_specular_texture'), 0);
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
     */
    bindViewMatrices(projectionMatrix, modelViewMatrix, normalMatrix) {
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_projectionMatrix'), false, new Float32Array(projectionMatrix.elements));
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_modelViewMatrix'), false, new Float32Array(modelViewMatrix.elements));
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'u_normalMatrix'), false, new Float32Array(normalMatrix.elements));
    }

    /**
     * Binds the camera position to the shader program.
     * @param {Vector3D} cameraPosition - The position of the camera in 3D space.
     */
    bindCameraPosition(cameraPosition) {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_viewPos'), cameraPosition.elements);
    }

    /**
     * Binds lighting properties (position, color, ambient properties) to the shader program.
     * @param {Object} light - The light object containing lighting properties. 
     * The structure of the object is described below.
     * @param {Array} light.position - The position of the light in 3D space.
     * @param {Array} light.color - The color of the light.
     * @param {Object} light.ambient - The ambient light properties.
     * @param {Array} light.ambient.color - The ambient light color.
     * @param {Number} light.ambient.strength - The strength of the ambient light.
     * @param {Array} light.materialReflectivity.Ka - The ambient reflectivity of the material.
     */
    bindLight(light) {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_lightPos'), light.position);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_lightColor'), light.color);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_Ka'), light.materialReflectivity.Ka);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_ambientColor'), light.ambient.color);
        this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_ambientStrength'), light.ambient.strength);
    }
}
