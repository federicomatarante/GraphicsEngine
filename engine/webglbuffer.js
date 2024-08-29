/**
 * WebGLBuffer Class
 * 
 * This class manages the setup and storage of various WebGL buffers and textures 
 * required for rendering 3D objects. It provides methods to create and bind buffers 
 * for vertex positions, texture coordinates, normals, material properties, and indices, 
 * as well as to set up textures for diffuse, normal, and specular mapping.
 * 
 * Usage:
 * 1. Create an instance of WebGLBuffer with a WebGL rendering context.
 * 2. Use setUpMeshes() to initialize buffers for mesh data (positions, normals, etc.).
 * 3. Use setUpTextures() to initialize textures (diffuse, normal, specular).
 */
class WebGLBuffer {
    /**
     * Constructor for the WebGLBuffer class.
     * @param {WebGLRenderingContext} gl - The WebGL rendering context.
     */
    constructor(gl) {
        this.gl = gl;
        this.positionsBuffer = null;
        this.texCoordBuffer = null;
        this.normalBuffer = null;
        this.indexBuffer = null;
        this.materialBuffer = null;
        this.diffuseTexture = null;
        this.normalTexture = null;
        this.specularTexture = null;
        this.trianglesNumber = 0; // Stores the number of triangles (or indices) for rendering
    }

    /**
     * Sets up the mesh buffers (positions, texture coordinates, normals, material properties, indices).
     * @param {Object} triangles - An object containing arrays of mesh data.
     * @param {Float32Array} triangles.positions - Array of vertex positions.
     * @param {Float32Array} triangles.texcoords - Array of texture coordinates.
     * @param {Float32Array} triangles.normals - Array of vertex normals.
     * @param {Float32Array} triangles.materials - Array of material properties (e.g., diffuse, specular).
     * @param {Uint16Array} triangles.indices - Array of vertex indices for indexed drawing.
     */
    setUpMeshes(triangles) {
        const gl = this.gl;

        // Set up positions buffer
        this.positionsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangles.positions, gl.STATIC_DRAW);

        // Set up texture coordinates buffer
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangles.texcoords, gl.STATIC_DRAW);

        // Set up normals buffer
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangles.normals, gl.STATIC_DRAW);

        // Set up materials buffer
        this.materialBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.materialBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangles.materials, gl.STATIC_DRAW);

        // Set up indices buffer
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles.indices, gl.STATIC_DRAW);

        // Store the number of triangles (indices)
        this.trianglesNumber = triangles.indices.length;
    }

    /**
     * Private method to set up a texture from an image.
     * @param {HTMLImageElement} texture - The image element containing the texture.
     * @returns {WebGLTexture} - The WebGL texture object.
     */
    #setUpTexture(texture) {
        const gl = this.gl;
        const textureObject = gl.createTexture();
        // TODO add feature to allow to speicfy more settings, like interpolation
        gl.bindTexture(gl.TEXTURE_2D, textureObject);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return textureObject;
    }

    /**
     * Sets up the textures for diffuse, normal, and specular mapping.
     * @param {Object} textures - An object containing the textures to be set up.
     * @param {HTMLImageElement} textures.diffuseTexture - The image element for the diffuse texture.
     * @param {HTMLImageElement} textures.normalTexture - The image element for the normal texture.
     * @param {HTMLImageElement} textures.specularTexture - The image element for the specular texture.
     */
    setUpTextures(textures) {
        this.diffuseTexture = textures.diffuseTexture ? this.#setUpTexture(textures.diffuseTexture) : null;
        this.normalTexture = textures.normalTexture ? this.#setUpTexture(textures.normalTexture) : null;
        this.specularTexture = textures.specularTexture ? this.#setUpTexture(textures.specularTexture) : null;
    }
}
