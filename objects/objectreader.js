/**
 * ObjectReader Class
 * A class for reading OBJ and MTL files to create a renderable object.
 */
class ObjectReader {
    /**
     * Creates an instance of ObjectReader with the specified OBJ and MTL file contents.
     * @param {string} objFile - The contents of the OBJ file as a string.
     * @param {string} mtlFile - The contents of the MTL file as a string.
     * @param {Object} textures - a ordered object mapping file names to images. The index will be used to assign the texture to a 
     */
    constructor(objFile, mtlFile,textures) {
        this.objFile = objFile; // The contents of the OBJ file.
        this.mtlFile = mtlFile; // The contents of the MTL file.
        this.textures = textures;
    }

    /**
     * Parses the OBJ and MTL files and creates a RenderObject.
     * @returns {Promise<RenderObject>} A promise that resolves to a RenderObject containing parsed vertex data, texture coordinates, normals, indices, and materials.
     * @throws {Error} Throws an error if there is an issue parsing the files or creating the RenderObject.
     */
    async getObject() {
        try {
            const parser = new ObjectParser(this.objFile, this.mtlFile,Object.keys(this.textures));
            const partNames = parser.getObjectNames();
            const renderObject = new RenderObject(Object.values(this.textures));
            for(const name of partNames){
                const objectPart = new RenderObjectPart(
                    parser.getVertices(name),    // Array of vertex positions.
                    parser.getTexCoords(name),   // Array of texture coordinates.
                    parser.getNormals(name),     // Array of normal vectors.
                    parser.getIndices(name),     // Array of indices for rendering the object.
                    parser.getMaterials(name),    // Array of material properties for the object.
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
