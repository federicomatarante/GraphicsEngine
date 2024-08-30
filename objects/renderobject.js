/**
 * RenderObject Class
 * A class representing a 3D object with position, orientation, and rendering data.
 */
class RenderObject {
    /**
     * Creates an instance of RenderObject with the specified data.
     * @param {Float32Array} vertexData - The vertex positions of the object.
     * @param {Float32Array} textureData - The texture coordinates of the object.
     * @param {Float32Array} normalsData - The normal vectors of the object.
     * @param {Uint16Array} indexData - The indices for rendering the object.
     * @param {Float32Array} materialData - The material properties of the object.
     * @param {Array} partialTextures - An array of {Image}, given the partial textsures of the renderobject.
     */
    constructor(vertexData, textureData, normalsData, indexData, materialData,partialTextures) {
        this.transformation = TransformationMatrix.identity(); // Initial orientation (identity matrix).
        this.vertexData = vertexData; // Vertex data (positions).
        this.renderData = vertexData; // Render data (initially the same as vertex data).
        this.textureData = textureData; // Texture coordinates.
        this.normalsData = normalsData; // Normal vectors.
        this.indexData = indexData; // Indices for rendering.
        this.materialData = materialData; // Material properties.
        this.diffuseTexture = null; // Placeholder for diffuse texture.
        this.normalTexture = null; // Placeholder for normal texture.
        this.specularTexture = null; // Placeholder for specular texture.
        this.partialTextures = partialTextures;
        this.objectXAxis = new Vector3D(1,0,0);
        this.objectYAxis = new Vector3D(0,1,0);
        this.objectZAxis = new Vector3D(0,0,1);
    }

    /**
     * Applies transformations (translation and rotation) to the object's vertex data.
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
     * Gets the buffers needed for rendering the object.
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
     * Gets the textures needed for rendering the object.
     * @returns {Object} An object containing the diffuse, normal and specular textures ( if present, else None ).
     */
    getTextures(){
        return {
            normalTexture: this.normalTexture,
            diffuseTexture: this.diffuseTexture,
            specularTexture: this.specularTexture,
        }
    }

    /**
     * Gets the partial textures needed for rendering the object.
     * @returns {Array{HTMLImageElement}} The list of partial textures.
     */
    getPartialTextures(){
        return this.partialTextures;
    }

    /**
     * Moves the object by the specified direction vector.
     * @param {Vector3D} direction - The direction vector to move the object.
     */
    move(direction) {
        const traslationMatrix = TransformationMatrix.createTraslationMatrix(direction);
        this.transformation = this.transformation.multiply(traslationMatrix);
        this.#applyTransformations();
    }

    /**
     * Rotates the object by applying the specified rotation matrix.
     * @param {number} x: rotation angle around x-axis.
     * @param {number} y: rotation angle around y-axis.
     * @param {number} z: rotation angle around z-axis.
     * @param {TransformationMatrix} rotMatrix - The rotation matrix to apply.
     */
    rotate(x,y,z) {
        const rotationMatrix = TransformationMatrix.createRotationMatrix(x,y,z,this.objectXAxis,this.objectYAxis,this.objectZAxis);
        //this.objectXAxis = rotationMatrix.transform(this.objectXAxis);
        //this.objectYAxis = rotationMatrix.transform(this.objectYAxis);
        //this.objectZAxis = rotationMatrix.transform(this.objectZAxis);
        this.transformation = this.transformation.multiply(rotationMatrix);
        this.#applyTransformations();
    }

    /**
     * Restore the original object's position and orientation.
     */
    resetTransformations(){
        this.transformation = TransformationMatrix.identity();
        this.#applyTransformations();
    }

    /**
     * Sets the position of the object.
     * @param {Vector3D} position - The new position of the object.
     */
    setPosition(position) {
        this.transformation.setTraslation(position);
        this.#applyTransformations();
    }

    /**
     * Sets the diffuse texture for the object.
     * @param {Texture} texture - The diffuse texture to apply.
     */
    setDiffuseTexture(texture) {
        this.diffuseTexture = texture;
    }

    /**
     * Sets the normal texture for the object.
     * @param {Texture} texture - The normal texture to apply.
     */
    setNormalTexture(texture) {
        this.normalTexture = texture;
    }

    /**
     * Sets the specular texture for the object.
     * @param {Texture} texture - The specular texture to apply.
     */
    setSpecularTexture(texture) {
        this.specularTexture = texture;
    }
}

/**
 * Cube Class
 * A class representing a 3D cube with a given side length and optional material data.
 */
class Cube extends RenderObject {
    /**
     * Creates an instance of Cube with the specified side length and optional material data.
     * @param {number} sideLength - The length of the sides of the cube.
     * @param {Object} [materialData=null] - Optional material data for the cube.
     */
    constructor(sideLength, materialData = null) {
        super();
        this.sideLength = sideLength; // The length of the sides of the cube.
        this.materials = materialData || {}; // Optional material data.
        this.vertices = []; // Array to hold the cube's vertices.
        this.faces = []; // Array to hold the cube's faces (triangles).
        this.#initGeometry(); // Initialize the geometry of the cube.
    }

    /**
     * Initializes the geometry of the cube by defining its vertices and faces.
     * @private
     */
    #initGeometry() {
        const halfSide = this.sideLength / 2;

        // Define the vertices of the cube
        this.vertices = [
            [-halfSide, -halfSide, halfSide], // 0
            [halfSide, -halfSide, halfSide], // 1
            [halfSide, halfSide, halfSide], // 2
            [-halfSide, halfSide, halfSide], // 3
            [-halfSide, -halfSide, -halfSide], // 4
            [halfSide, -halfSide, -halfSide], // 5
            [halfSide, halfSide, -halfSide], // 6
            [-halfSide, halfSide, -halfSide]  // 7
        ];

        // Define the faces of the cube (each face is composed of two triangles)
        this.faces = [
            [0, 1, 2], [0, 2, 3], // Front face
            [1, 5, 6], [1, 6, 2], // Right face
            [5, 4, 7], [5, 7, 6], // Back face
            [4, 0, 3], [4, 3, 7], // Left face
            [3, 2, 6], [3, 6, 7], // Top face
            [4, 5, 1], [4, 1, 0]  // Bottom face
        ];
    }

    /**
     * Gets the buffers needed for rendering the cube.
     * @returns {Object} An object containing the vertex positions, texture coordinates, normals, indices, and materials.
     */
    getTriangles() {
        const positions = [];
        const texcoords = [];
        const normals = [];
        const indices = [];
        const materials = this.getMaterials(); // Use getMaterials to get material data

        for (let i = 0; i < this.faces.length; i++) {
            const [v1, v2, v3] = this.faces[i];
            positions.push(...this.vertices[v1]);
            positions.push(...this.vertices[v2]);
            positions.push(...this.vertices[v3]);
            indices.push(i * 3, i * 3 + 1, i * 3 + 2);

            // Calculate normals for each triangle
            const normal = this.#calculateNormal(this.vertices[v1], this.vertices[v2], this.vertices[v3]);
            normals.push(...normal, ...normal, ...normal);

            // Texture coordinates placeholder (adjust as needed)
            texcoords.push(0, 0, 1, 0, 1, 1);
        }

        return {
            positions: new Float32Array(positions),
            texcoords: new Float32Array(texcoords),
            normals: new Float32Array(normals),
            indices: new Uint16Array(indices),
            materials: materials // Return material data
        };
    }

    /**
     * Calculates the normal vector for a given triangle.
     * @param {number[]} v1 - The first vertex of the triangle.
     * @param {number[]} v2 - The second vertex of the triangle.
     * @param {number[]} v3 - The third vertex of the triangle.
     * @returns {number[]} The normal vector of the triangle.
     * @private
     */
    #calculateNormal(v1, v2, v3) {
        const a = new Vector3D(...v2).subtract(new Vector3D(...v1));
        const b = new Vector3D(...v3).subtract(new Vector3D(...v1));
        return a.cross(b).normalize().elements;
    }

    /**
     * Gets the materials for the cube's faces.
     * @returns {Float32Array} An array of material properties for the cube's faces.
     */
    getMaterials() {
        const materials = [];
        for (let face of this.faces) {
            for (let vertexIndex of face) {
                // Generate the key to look up material data
                const materialKey = `material_${vertexIndex}`;

                if (this.materials && this.materials[materialKey]) {
                    const material = this.materials[materialKey];
                    materials.push(
                        parseFloat(material.Kd[0]),
                        parseFloat(material.Kd[1]),
                        parseFloat(material.Kd[2]),
                        parseFloat(material.Ks[0]),
                        parseFloat(material.Ks[1]),
                        parseFloat(material.Ks[2]),
                        parseFloat(material.Ns)
                    );
                } else {
                    // Default material if none is specified
                    materials.push(
                        0.8, 0.8, 0.8,  // Kd default
                        0.5, 0.5, 0.5,  // Ks default
                        32.0            // Ns default
                    );
                }
            }
        }
        return new Float32Array(materials);
    }
}
