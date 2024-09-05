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
     * @description Initializes buffers and textures for rendering 3D objects.
     */
    constructor(gl) {
        this.gl = gl;
        this.positionsBuffer = null;
        this.texCoordBuffer = null;
        this.normalBuffer = null;
        this.diffuseTexture = null;
        this.normalTexture = null;
        this.specularTexture = null;
        this.partialTextures = []
        this.lineIndexBuffer = null;
        this.materialsIndexBuffer = null;
        this.indexBuffer = null;
        this.indexInformation = [];
        this.trianglesNumber = 0;
        this.linesNumber = 0;
    }

    /**
     * Sets up the mesh buffers (positions, texture coordinates, normals, material properties, indices).
     * @param {Object} triangles - An object containing arrays of mesh data.
     * @param {Float32Array} triangles.positions - Array of vertex positions.
     * @param {Float32Array} triangles.texcoords - Array of texture coordinates.
     * @param {Float32Array} triangles.normals - Array of vertex normals.
     * @param {Float32Array} triangles.materialIndexData - Array of material indices.
     * @param {Uint16Array} triangles.indexData - Array of vertex indices for indexed drawing.
     * @param {Uint16Array} triangles.lineIndexData - Array of line indices for line drawing.
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

        // Set up Material indices buffer
        this.materialsIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.materialsIndexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangles.materialIndexData, gl.STATIC_DRAW);

        // Set up indices buffer
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles.indexData, gl.STATIC_DRAW);
        // Set up line indices buffer
        this.lineIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles.lineIndexData, gl.STATIC_DRAW);


        // Store the number of triangles (indices)
        this.trianglesNumber = triangles.indexData.length;
        this.linesNumber = triangles.lineIndexData.length;
    }

    /**
     * Sets up the index information.
     * @param {Array} indexInformation - Array of index information.
     * @description Stores additional information related to indices.
     */
    setUpIndexInformation(indexInformation){
        this.indexInformation = indexInformation;
    }

    /**
     * Private method to set up a texture from an image.
     * @param {HTMLImageElement} image - The image element containing the texture.
     * @returns {WebGLTexture} - The WebGL texture object.
     * @description Creates and configures a texture object based on the provided image.
     */
    #setUpTexture(image) {
        const gl = this.gl;
    
        // Create a new texture object
        const textureObject = gl.createTexture();
        if (!textureObject) {
            console.error('Failed to create texture.');
            return null;
        }
    
        const isPowerOfTwo = (number) => (number & (number - 1)) === 0;
    
        // Bind the texture object to TEXTURE_2D
        gl.bindTexture(gl.TEXTURE_2D, textureObject);
    
        // Ensure image is fully loaded
        if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
            // Check if image is a power-of-two texture
            if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
        } else {
            console.error('Image not loaded or has invalid dimensions.');
            gl.bindTexture(gl.TEXTURE_2D, null);
            return null;
        }
    
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        return textureObject;
    }


    

    /**
     * Sets up the textures for diffuse, normal, and specular mapping.
     * @param {Object} textures - An object containing the textures to be set up.
     * @param {HTMLImageElement} textures.diffuseTexture - The image element for the diffuse texture.
     * @param {HTMLImageElement} textures.normalTexture - The image element for the normal texture.
     * @param {HTMLImageElement} textures.specularTexture - The image element for the specular texture.
     * @description Initializes the textures for different mapping types using image elements.
     */
    setUpTextures(textures) {
        this.diffuseTexture = textures.diffuseTexture ? this.#setUpTexture(textures.diffuseTexture) : null;
        this.normalTexture = textures.normalTexture ? this.#setUpTexture(textures.normalTexture) : null;
        this.specularTexture = textures.specularTexture ? this.#setUpTexture(textures.specularTexture) : null;
    }

    /**
     * Sets up the partial textures of the object.
     * @param {Array<HTMLImageElement>} textures - The textures to be set up.
     * @description Initializes a list of partial textures with a limit of 16 textures.
     */
    setUpPartialTextures(textures) {
       this.partialTextures = [];
       for (let i = 0; i < Math.min(textures.length, 16); i++) { // Limit to 16 textures
           const texture = textures[i];
           const textureObject = this.#setUpTexture(texture);
           if (textureObject) {
               this.partialTextures.push(textureObject);
           } else {
               console.warn(`Failed to set up texture at index ${i}.`);
           }
       }
    }

    /**
     * Sets up the materials for the object.
     * @param {Array} materials - Array of material properties.
     * @description Stores material properties to be used for rendering.
     */
    setUpMaterials(materials){
        this.materials = materials;
    }

}
