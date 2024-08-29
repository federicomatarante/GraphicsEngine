/**
 * ObjectReader Class
 * A class for reading OBJ and MTL files to create a renderable object.
 */
class ObjectReader {
    /**
     * Creates an instance of ObjectReader with the specified OBJ and MTL file contents.
     * @param {string} objFile - The contents of the OBJ file as a string.
     * @param {string} mtlFile - The contents of the MTL file as a string.
     */
    constructor(objFile, mtlFile) {
        this.objFile = objFile; // The contents of the OBJ file.
        this.mtlFile = mtlFile; // The contents of the MTL file.
    }

    /**
     * Parses the OBJ and MTL files and creates a RenderObject.
     * @returns {Promise<RenderObject>} A promise that resolves to a RenderObject containing parsed vertex data, texture coordinates, normals, indices, and materials.
     * @throws {Error} Throws an error if there is an issue parsing the files or creating the RenderObject.
     */
    async getObject() {
        try {
            const parser = new ObjectParser(this.objFile, this.mtlFile);
            
            return new RenderObject(
                parser.getVertices(),    // Array of vertex positions.
                parser.getTexCoords(),   // Array of texture coordinates.
                parser.getNormals(),     // Array of normal vectors.
                parser.getIndices(),     // Array of indices for rendering the object.
                parser.getMaterials(),    // Array of material properties for the object.
            );
        } catch (error) {
            // Log any errors and rethrow them.
            console.error('Error getting object:', error);
            throw error;
        }
    }
}
