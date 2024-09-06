/**
 * RenderObjectPart Class
 * Represents a part of a 3D object with its own rendering data and transformations.
 */
class RenderObjectPart {
    /**
     * Creates an instance of RenderObjectPart with the specified data.
     * @param {number} indexLenght - The length of the index data for rendering the part.
     * @param {number} lineIndexLenght - The length of the line index data for rendering the part.
     * @param {number} materialsIndexLength - The length of the material index data for the part.
     */
    constructor(indexLenght, lineIndexLenght, materialsIndexLength) {
        this.indexLenght = indexLenght;
        this.lineIndexLenght = lineIndexLenght;
        this.materialsIndexLength = materialsIndexLength;
    }

    /**
     * Retrieves information about the part's index, line index, and material indices lengths.
     * @returns {Object} An object containing the index length, line index length, and materials index length.
     */
    getIndexInfo() {
        return {
            indexLenght: this.indexLenght,
            lineIndexLenght: this.lineIndexLenght,
            materialsIndexLength: this.materialsIndexLength
        }
    }
}


/**
 * RenderObject Class
 * Represents a 3D object composed of multiple parts with position, orientation, and rendering data.
 */
class RenderObject {
    /**
     * Creates an instance of RenderObject, which can consist of multiple parts.
     * @param {Float32Array} vertexData - An array of vertex positions.
     * @param {Float32Array} textureData - An array of texture coordinates.
     * @param {Float32Array} normalsData - An array of normal vectors.
     * @param {Array} materials - An array of material properties for the object.
     * @param {Uint16Array} indexData - An array of indices for rendering the object.
     * @param {Uint16Array} lineIndexData - An array of line indices for rendering.
     * @param {Float32Array} materialIndexData - An array of material indices.
     * @param {Array} [partialTextures=[]] - An array of partial textures.
     */
    constructor(vertexData, textureData, normalsData, materials, indexData, lineIndexData, materialIndexData, partialTextures = []) {
        this.transformation = TransformationMatrix.identity(); // Initial orientation (identity matrix).
        this.vertexData = vertexData; // Vertex data (positions).
        this.renderData = vertexData; // Render data (initially the same as vertex data).
        this.textureData = textureData; // Texture coordinates.
        this.normalsData = normalsData; // Normal vectors.
        this.materials = materials; // Material properties.
        this.invertCoords = false; // Invert Y-axis texture cooridnates
        this.parts = []; // Array to store different parts of the object.
        this.objectXAxis = new Vector3D(1, 0, 0);
        this.objectYAxis = new Vector3D(0, 1, 0);
        this.objectZAxis = new Vector3D(0, 0, 1);
        this.diffuseTexture = null; // Placeholder for diffuse texture.
        this.normalTexture = null; // Placeholder for normal texture.
        this.specularTexture = null; // Placeholder for specular texture.
        this.partialTextures = partialTextures; // List of partial textures.
        this.indexData = indexData; // Indices for rendering.
        this.lineIndexData = lineIndexData; // Line indices for rendering.
        this.materialIndexData = materialIndexData; // Material indices for rendering.
    }

    /**
     * Adds a new part to the RenderObject.
     * @param {RenderObjectPart} part - The RenderObjectPart to add.
     */
    addPart(part) {
        this.parts.push(part);
    }

    /**
     * Retrieves the list of parts composing the object.
     * @returns {Array<RenderObjectPart>} The list of RenderObjectPart instances.
     */
    getParts() {
        return this.parts;
    }

    /**
     * Applies transformations (translation and rotation) to the part's vertex data.
     * @private
     */
    #applyTransformations() {
        this.renderData = [];
        for (let i = 0; i < this.vertexData.length; i += 3) {
            const elems = [this.vertexData[i], this.vertexData[i + 1], this.vertexData[i + 2]];
            const tmpVector = Vector3D.fromArray(elems);
            const transformedVector = this.transformation.transform(tmpVector);
            this.renderData.push(transformedVector.x, transformedVector.y, transformedVector.z);
        }
        this.renderData = new Float32Array(this.renderData);
    }

    /**
     * Retrieves the buffers needed for rendering the object part.
     * @returns {Object} An object containing the vertex positions, texture coordinates, normals, indices, line indices, and materials.
     */
    getTriangles() {
        return {
            positions: this.renderData,
            texcoords: this.textureData,
            normals: this.normalsData,
            indexData: this.indexData,
            lineIndexData: this.lineIndexData,
            materialIndexData: this.materialIndexData,
            invertTextureCoords: this.invertCoords
        };
    }

    /**
     * Moves the part by the specified direction vector.
     * @param {Vector3D} direction - The direction vector to move the part.
     */
    move(direction) {
        const translationMatrix = TransformationMatrix.createTraslationMatrix(direction);
        this.transformation = this.transformation.multiply(translationMatrix);
        this.#applyTransformations();
    }

    /**
     * Rotates the part by applying the specified rotation matrix.
     * @param {number} x - Rotation angle around x-axis.
     * @param {number} y - Rotation angle around y-axis.
     * @param {number} z - Rotation angle around z-axis.
     */
    rotate(x, y, z) {
        const rotationMatrix = TransformationMatrix.createRotationMatrix(x, y, z);
        this.transformation = this.transformation.multiply(rotationMatrix);
        this.#applyTransformations();
    }

    /**
     * Sets the position of the part.
     * @param {Vector3D} position - The new position.
     */
    setPosition(position) {
        this.transformation.setTraslation(position);
        this.#applyTransformations();
    }


    /**
     * Checks whether to invert the texture coordinates in the y-axis.
     * @param {bool} invertCoords - Flag to invert coords.
     */
    setInvertTextureCoords(invertCoords){
        this.invertCoords = invertCoords;
    }


    /**
     * Resets the transformations of the part to its original state.
     */
    resetTransformations() {
        this.transformation = TransformationMatrix.identity();
        this.#applyTransformations();
    }

    /**
     * Sets the diffuse texture for the part.
     * @param {Texture} texture - The diffuse texture to apply.
     */
    setDiffuseTexture(texture) {
        this.diffuseTexture = texture;
    }

    /**
     * Sets the normal texture for the part.
     * @param {Texture} texture - The normal texture to apply.
     */
    setNormalTexture(texture) {
        this.normalTexture = texture;
    }

    /**
     * Sets the specular texture for the part.
     * @param {Texture} texture - The specular texture to apply.
     */
    setSpecularTexture(texture) {
        this.specularTexture = texture;
    }

    /**
     * Retrieves the textures needed for rendering the part.
     * @returns {Object} An object containing the diffuse, normal, and specular textures (if present, otherwise null).
     */
    getTextures() {
        return {
            normalTexture: this.normalTexture,
            diffuseTexture: this.diffuseTexture,
            specularTexture: this.specularTexture
        };
    }

    /**
     * Retrieves the partial textures needed for rendering the part.
     * @returns {Array<HTMLImageElement>} The list of partial textures.
     */
    getPartialTextures() {
        return this.partialTextures;
    }

    /**
     * Retrieves the materials for the part.
     * @returns {Array} The list of materials.
     */
    getMaterials() {
        return this.materials;
    }
}
