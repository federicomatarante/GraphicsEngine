/**
 * ObjectParser
 * A class to parse 3D model data from OBJ and MTL files. It extracts vertices, normals, texture coordinates, lines, and material information.
 */
class ObjectParser {
    /**
     * Creates a new ObjectParser instance and parses the given OBJ and MTL strings.
     * @param {string} objString - The content of the OBJ file as a string.
     * @param {string} mtlString - The content of the MTL file as a string.
     * @param {Array} textures - An ordered array of texture file names. The index will be used to assign the texture to a material.
     */
    constructor(objString, mtlString, textures) {
        this.objects = {}; // Store multiple objects by name
        this.vertices = []; // Global list of vertices
        this.normals = [];  // Global list of normals
        this.texCoords = []; // Global list of texture coordinates
        this.lines = {}; // Store lines by object name
        this.materials = {
            'default': new MaterialBuffer('default')
        };
        this.textures = textures;
        this.currentObjectName = null;
        this.#parseMTL(mtlString);
        this.#parseOBJ(objString);
    }

    /**
     * Initializes an object with empty arrays for faces, lines, and material information.
     * @param {string} objectName - The name of the object to initialize.
     * @private
     */
    #initializeObject(objectName) {
        this.objects[objectName] = {
            faces: [],
            lines: [], // Initialize line data
            materials: [] // Store material information used by the object
        };
    }

    /**
     * Parses the MTL (material) string and stores material properties.
     * @param {string} text - The content of the MTL file as a string.
     * @private
     */
    #parseMTL(text) {
        let textureName, textureIndex;
        const lines = text.split('\n');
        let currentMaterial = null;
        for (let line of lines) {
            line = line.trim();
            const parts = line.split(" ");
            if (parts.length === 0) continue;
            switch (parts[0]) {
                case 'newmtl':
                    const material = new MaterialBuffer(parts[1])
                    currentMaterial = material;
                    this.materials[parts[1]] = currentMaterial;
                    break;
                case 'illum':
                    currentMaterial.illum = parseFloat(parts[1]);
                    break;
                case 'Ka':
                    currentMaterial.Ka = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    break;
                case 'Kd':
                    currentMaterial.Kd = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    break;
                case 'Ks':
                    currentMaterial.Ks = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    break;
                case 'Ke':
                    currentMaterial.Ke = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    break;
                case 'map_Ke':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.emissionTexture = textureIndex;
                    break;
                case 'map_Kd':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.diffuseTexture = textureIndex;
                    break;
                case 'map_Ns':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.shininessTexture = textureIndex;
                    break;
                case 'bump':
                case 'map_Bump':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.normalTexture = textureIndex;
                    break;
                case 'map_Ks':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.specularTexture = textureIndex;
                    break;
                case 'map_Ka':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    currentMaterial.ambientTexture = textureIndex;
                    break;
                case 'Tr':
                    const tr = parseFloat(parts[1]);
                    currentMaterial.alpha = 1.0 - tr;
                    break;
                case 'Tf':
                    const tf = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    currentMaterial.transmissionFilter = tf;
                    break;
                case 'Ns':
                    currentMaterial.Ns = parseFloat(parts[1]);
                    break;
                case 'd':
                    currentMaterial.alpha = parseFloat(parts[1]);
                    break;
                case 'Ni':
                    currentMaterial.Ni = parseFloat(parts[1]);
                    break;
                case 'refl': // Reflection, not implemented
                case '#':
                case '':
                    break;
                    
                default:
                    console.error("Unexpected command! " + line);
            }
        }
    }

    /**
     * Parses the OBJ string and stores vertex, normal, texture, line, and face data.
     * @param {string} text - The content of the OBJ file as a string.
     * @private
     */
    #parseOBJ(text) {
        const lines = text.split('\n');
        let currentMaterialIdx = -1;

        for (let line of lines) {
            line = line.trim();
            const parts = line.split(" ");
            if (parts.length === 0) continue;

            switch (parts[0]) {
                case 'o': // New Object
                case 'g': // New Group
                    this.currentObjectName = parts[1] ?? 'default';
                    if (!this.objects[this.currentObjectName]) {
                        this.#initializeObject(this.currentObjectName);
                    }
                    break;
                case 'v': // Vertex
                    this.vertices.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                    break;
                case 'vn': // Normals
                    this.normals.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                    break;
                case 'vt': // Texture coordinates
                    this.texCoords.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2])
                    );
                    break;
                case 'f': // Face information
                    const face = [];
                    for (let i = 1; i < parts.length; i++) {
                        const vertexData = parts[i].split('/');
                        face.push({
                            vertexIndex: parseInt(vertexData[0]) - 1,
                            texCoordIndex: vertexData[1] ? parseInt(vertexData[1]) - 1 : -1,
                            normalIndex: vertexData[2] ? parseInt(vertexData[2]) - 1 : -1,
                            material: currentMaterialIdx
                        });
                    }
                    this.objects[this.currentObjectName].faces.push(face);
                    break;
                case 'l': // Line information
                    const lineSegments = [];
                    for (let i = 1; i < parts.length; i++) {
                        lineSegments.push(parseInt(parts[i]) - 1);
                    }
                    this.objects[this.currentObjectName].lines.push(lineSegments);
                    break;
                case 'usemtl': // Use a specific material for subsequent faces
                    currentMaterialIdx = Object.keys(this.materials).indexOf(parts[1].replaceAll("\"",''),1);
                    if(currentMaterialIdx === -1){
                        console.error("Couldn't find material ", parts[1], " in the .mtl file");
                    }
                    break;
                case "#": // Comment
                case 'mtllib': // Reference to material file (ignored here)
                case 's': // Smoothing group (ignored)
                case '':
                    break;
                default:
                    console.error("Unexpected command! " + line);
            }
        }
    }

    /**
     * Retrieves all vertices as a flat Float32Array.
     * @returns {Float32Array} The array of vertices.
     */
    getVertices() {
        const vertices = []; // TODO what if it's not a triangle
        for(const objectName of this.getObjectNames()){
            for (let face of this.objects[objectName].faces) {
                for (let vertex of face) {
                    const vi = vertex.vertexIndex;
                    if(vi * 3 + 2 >= this.vertices.length){
                        console.error("Index out of bound! Value: ", vi * 3 + 2, "/", this.vertices.length);
                    }
                    vertices.push(
                        this.vertices[vi * 3],
                        this.vertices[vi * 3 + 1],
                        this.vertices[vi * 3 + 2]
                    );
                }
            }
        }
        return new Float32Array(vertices);
    }

    /**
     * Retrieves all texture coordinates as a flat Float32Array.
     * @returns {Float32Array} The array of texture coordinates.
     */
    getTexCoords() {
        const texCoords = [];
        for(const objectName of this.getObjectNames()){
            for (let face of this.objects[objectName].faces) {
                for (let vertex of face) {
                    if (vertex.texCoordIndex !== -1) {
                        const ti = vertex.texCoordIndex;
                        if(ti * 2 + 1 >= this.texCoords.length){
                            console.error("Index out of bound! Value: ", ti * 2 + 1, "/", this.texCoords.length);
                        }
                        texCoords.push(
                            this.texCoords[ti * 2],
                            this.texCoords[ti * 2 + 1]
                        );
                    } else {
                        texCoords.push(0, 0);
                    }
                }
            }
        }
        return new Float32Array(texCoords);
    }

    /**
     * Retrieves all normals as a flat Float32Array.
     * @returns {Float32Array} The array of normals.
     */
    getNormals() {
        const normals = [];
        for(const objectName of this.getObjectNames()){
            for (let face of this.objects[objectName].faces) {
                if (face[0].normalIndex !== -1) {
                    for (let vertex of face) {
                        const ni = vertex.normalIndex;
                        normals.push(this.normals[ni * 3], this.normals[ni * 3 + 1], this.normals[ni * 3 + 2]);
                    }
                } else {
                    const v1 = this.vertices.slice(face[0].vertexIndex * 3, face[0].vertexIndex * 3 + 3);
                    const v2 = this.vertices.slice(face[1].vertexIndex * 3, face[1].vertexIndex * 3 + 3);
                    const v3 = this.vertices.slice(face[2].vertexIndex * 3, face[2].vertexIndex * 3 + 3);
                    
                    const normal = this.calculateNormal(v1, v2, v3);
                    
                    for (let i = 0; i < face.length; i++) {
                        normals.push(...normal);
                    }
                }
            }
        }
        return new Float32Array(normals);
    }
    
    /**
     * Calculates the normal vector for a triangle defined by three vertices.
     * @param {Array<number>} v1 - The first vertex of the triangle.
     * @param {Array<number>} v2 - The second vertex of the triangle.
     * @param {Array<number>} v3 - The third vertex of the triangle.
     * @returns {Array<number>} The normalized normal vector.
     */
    calculateNormal(v1, v2, v3) {
        const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
        const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
        
        const normal = [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];
        
        const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
        
        return [normal[0] / length, normal[1] / length, normal[2] / length];
    }

    /**
     * Retrieves all materials of a specific object as a flat Float32Array.
     * @param {string} objectName - The name of the object to retrieve materials for.
     * @returns {Object} An object containing:
     * - indicesCounts: An object where keys are object names and values are counts of indices.
     * - indices: A Float32Array of material indices.
     * - materials: An array of MaterialBuffer instances.
     */
    getMaterials() {
        const indicesCounts = {};
        const materialIndices = [];
        for(const objectName of this.getObjectNames()){
            indicesCounts[objectName] = 0;
            for (let face of this.objects[objectName].faces) {
                for (let vertex of face) {
                    indicesCounts[objectName] += 1;
                    materialIndices.push(vertex.material ?? 0);
                }
            }
        }
        return {
            indicesCounts: indicesCounts,
            indices: new Float32Array(materialIndices),
            materials: Object.values(this.materials)
        }
    }

    /**
     * Retrieves all indices for rendering triangles of a specific object as a Uint16Array.
     * @param {string} objectName - The name of the object to retrieve indices for.
     * @returns {Uint16Array} The array of indices.
     */
    getIndices() {
        const indexCount = {};
        indexCount['buffer'] = [];
        let index = 0;
        for(const objectName of this.getObjectNames()){
            if(!(objectName in indexCount)){
                indexCount[objectName] = 0;
            }
            for (let face of this.objects[objectName].faces) {
                if (face.length === 3) {
                    indexCount['buffer'].push(index, index + 1, index + 2);
                    indexCount[objectName] += 3;
                } else if (face.length > 3) {
                    for (let i = 1; i < face.length - 1; i++) {
                        indexCount['buffer'].push(index, index + i, index + i + 1);
                        indexCount[objectName] += 3;
                    }
                }
                index += face.length;
            }
        }
        indexCount['buffer'] = new Uint32Array(indexCount['buffer']);
        return indexCount;
    }

    /**
     * Retrieves all line indices of a specific object as a Uint16Array.
     * @param {string} objectName - The name of the object to retrieve line indices for.
     * @returns {Uint16Array} The array of line indices.
     */
    getLineIndices() {
        const linesCount = {};
        linesCount['buffer'] = [];
        for(const objectName of this.getObjectNames()){
            linesCount[objectName] = 0;
            for (let line of this.objects[objectName].lines) {
                for (let i = 0; i < line.length - 1; i++) {
                    linesCount['buffer'].push(line[i], line[i + 1]);
                    linesCount[objectName] += 2;
                }
            }
        }
        linesCount['buffer'] = new Uint32Array(linesCount['buffer']);
        return linesCount;
    }

    /**
     * @returns {Array<string>} The list of object names.
     */
    getObjectNames() {
        return Object.keys(this.objects);
    }
}
