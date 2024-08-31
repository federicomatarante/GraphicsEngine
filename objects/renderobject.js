/**
 * RenderObjectPart Class
 * Represents a part of a 3D object with its own rendering data and transformations.
 */
class RenderObjectPart {
    /**
     * Creates an instance of RenderObjectPart with the specified data.
     * @param {Float32Array} vertexData - The vertex positions of the object part.
     * @param {Float32Array} textureData - The texture coordinates of the object part.
     * @param {Float32Array} normalsData - The normal vectors of the object part.
     * @param {Uint16Array} indexData - The indices for rendering the object part.
     * @param {Float32Array} materialData - The material properties of the object part.
     */
    constructor(vertexData, textureData, normalsData, indexData, materialData) {
        this.transformation = TransformationMatrix.identity(); // Initial orientation (identity matrix).
        this.vertexData = vertexData; // Vertex data (positions).
        this.renderData = vertexData; // Render data (initially the same as vertex data).
        this.textureData = textureData; // Texture coordinates.
        this.normalsData = normalsData; // Normal vectors.
        this.indexData = indexData; // Indices for rendering.
        this.materialData = materialData; // Material properties.
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
     * Gets the buffers needed for rendering the part.
     * @returns {Object} An object containing the vertex positions, texture coordinates, normals, indices, and materials.
     */
    getTriangles() {
        return {
            positions: this.renderData,
            texcoords: this.textureData,
            normals: this.normalsData,
            indices: this.indexData,
            materials: this.materialData
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
     * Resets the transformations of the part to its original state.
     */
    resetTransformations() {
        this.transformation = TransformationMatrix.identity();
        this.#applyTransformations();
    }

}

/**
 * RenderObject Class
 * Represents a 3D object composed of multiple parts with position, orientation, and rendering data.
 */
class RenderObject {
    /**
     * Creates an instance of RenderObject, which can consist of multiple parts.
    * @param {Array} partialTextures - An array of {Image}, given the partial textures of the render object part.
 
    */
    constructor(partialTextures = []) {
        this.parts = []; // Array to store different parts of the object.
        this.objectXAxis = new Vector3D(1, 0, 0);
        this.objectYAxis = new Vector3D(0, 1, 0);
        this.objectZAxis = new Vector3D(0, 0, 1);
        this.diffuseTexture = null; // Placeholder for diffuse texture.
        this.normalTexture = null; // Placeholder for normal texture.
        this.specularTexture = null; // Placeholder for specular texture.
        this.partialTextures = partialTextures;
    }

    /**
     * Adds a new part to the RenderObject.
     * @param {RenderObjectPart} part - The RenderObjectPart to add.
     */
    addPart(part) {
        this.parts.push(part);
    }


    /**
     * @returns {Array{RenderObjectPart}} the list of parts composing the object.
     */
    getParts(){
        return this.parts;
    }

    /**
     * Moves all parts of the object by the specified direction vector.
     * @param {Vector3D} direction - The direction vector to move the object.
     */
    move(direction) {
        for (let part of this.parts) {
            part.move(direction);
        }
    }

    /**
     * Rotates all parts of the object by applying the specified rotation matrix.
     * @param {number} x - Rotation angle around x-axis.
     * @param {number} y - Rotation angle around y-axis.
     * @param {number} z - Rotation angle around z-axis.
     */
    rotate(x, y, z) {
        for (let part of this.parts) {
            part.rotate(x, y, z);
        }
    }

    /**
     * Resets transformations of all parts of the object to their original states.
     */
    resetTransformations() {
        for (let part of this.parts) {
            part.resetTransformations();
        }
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
     * Gets the textures needed for rendering the part.
     * @returns {Object} An object containing the diffuse, normal, and specular textures (if present, else None).
     */
    getTextures() {
        return {
            normalTexture: this.normalTexture,
            diffuseTexture: this.diffuseTexture,
            specularTexture: this.specularTexture,
        };
    }

    /**
     * Gets the partial textures needed for rendering the part.
     * @returns {Array{HTMLImageElement}} The list of partial textures.
     */
    getPartialTextures() {
        return this.partialTextures;
    }
}
