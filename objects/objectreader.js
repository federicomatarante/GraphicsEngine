/**
 * ObjectReader Class
 * A class for reading OBJ and MTL files to create a renderable object.
 */
class ObjectReader {
    /**
     * Creates an instance of ObjectReader with the specified OBJ and MTL file contents.
     * @param {string} objFile - The contents of the OBJ file as a string.
     * @param {string} mtlFile - The contents of the MTL file as a string.
     * @param {Object} textures - An ordered object mapping file names to images. The index will be used to assign the texture to a material.
     */
    constructor(objFile, mtlFile, textures) {
        this.objFile = objFile; // The contents of the OBJ file.
        this.mtlFile = mtlFile; // The contents of the MTL file.
        this.textures = textures; // An ordered object mapping file names to images.
    }

    /**
     * Parses the OBJ and MTL files and creates a RenderObject.
     * @returns {Promise<RenderObject>} A promise that resolves to a RenderObject containing parsed vertex data, texture coordinates, normals, indices, and materials.
     * @throws {Error} Throws an error if there is an issue parsing the files or creating the RenderObject.
     */
    async getObject() {
        try {
            // Create an ObjectParser instance with the provided OBJ and MTL file contents and textures.
            const parser = new ObjectParser(this.objFile, this.mtlFile, Object.keys(this.textures));
            
            // Get object names, indices, line indices, and materials from the parser.
            let partNames = parser.getObjectNames();
            const indexInfo = parser.getIndices();
            const linesIndexInfo = parser.getLineIndices();
            const materials = parser.getMaterials();
            
            // Create a RenderObject instance with parsed data.
            const renderObject = new RenderObject(
                parser.getVertices(),    // Array of vertex positions.
                parser.getTexCoords(),   // Array of texture coordinates.
                parser.getNormals(),     // Array of normal vectors.
                materials.materials,    // Array of material properties for the object.
                indexInfo.buffer,     // Array of indices for rendering the object.
                linesIndexInfo.buffer, // Array of line indices for rendering.
                materials.indices,     // Array of material indices.
                Object.values(this.textures), // Array of textures.
            );
            
            // Add each part of the object to the RenderObject.
            for (const name of partNames) {
                const objectPart = new RenderObjectPart(
                    indexInfo[name],           // Indices for this part.
                    linesIndexInfo[name],      // Line indices for this part.
                    materials.indicesCounts[name] // Count of indices for this part.
                );
                renderObject.addPart(objectPart);
            }
            
            return renderObject;
        } catch (error) {
            // Log any errors and rethrow them.
            console.error('Error getting object:', error);
            throw error;
        }
    }
}
