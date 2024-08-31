/**
 * ObjectParser
 * A class to parse 3D model data from OBJ and MTL files. It extracts vertices, normals, texture coordinates, and material information.
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
        this.materials = {};
        this.textures = textures;
        this.currentObjectName = 'default'; // Default object name
        this.#initializeObject(this.currentObjectName); // Initialize the default object
        this.#parseOBJ(objString);
        this.#parseMTL(mtlString);
    }

    /**
     * Initializes an object with empty arrays for faces and material information.
     * @param {string} objectName - The name of the object to initialize.
     * @private
     */
    #initializeObject(objectName) {
        this.objects[objectName] = {
            faces: [],
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
        let currentMtlName = null;
        for (let line of lines) {
            line = line.trim();
            const parts = line.split(" ");
            if (parts.length == 0) continue;
            switch (parts[0]) {
                case 'newmtl':
                    currentMtlName = parts[1];
                    this.materials[currentMtlName] = {};
                    break;
                case 'Ns':
                case 'Ni':
                case 'd':
                case 'illum':
                    this.materials[currentMtlName][parts[0]] = parts[1];
                    break;
                case 'Ka':
                case 'Kd':
                case 'Ks':
                case 'Ke':
                    this.materials[currentMtlName][parts[0]] = [parts[1], parts[2], parts[3]];
                    break;
                case 'map_Kd':
                    textureName = parts[1].split('/').pop().split('\\').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    this.materials[currentMtlName]["diffuse_texture"] = textureIndex;
                    break;
                case 'bump':
                case 'map_Bump':
                    textureName = parts[1].split('/').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    this.materials[currentMtlName]["normal_texture"] = textureIndex;
                    break;
                case 'map_Ks':
                    textureName = parts[1].split('/').pop();
                    textureIndex = this.textures.indexOf(textureName);
                    this.materials[currentMtlName]["specular_texture"] = textureIndex;
                    break;
                case '#':
                case '':
                    break;
                default:
                    console.error("Unexpected command! " + line);
            }
        }
    }

    /**
     * Parses the OBJ string and stores vertex, normal, texture, and face data.
     * @param {string} text - The content of the OBJ file as a string.
     * @private
     */
    #parseOBJ(text) {
        const lines = text.split('\n');
        let currentMaterial = null;

        for (let line of lines) {
            line = line.trim();
            const parts = line.split(" ");
            if (parts.length === 0) continue;

            switch (parts[0]) {
                case 'o': // New Object
                case 'g': // New Group
                    this.currentObjectName = parts[1] || 'default';
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
                            material: currentMaterial
                        });
                    }
                    this.objects[this.currentObjectName].faces.push(face);
                    break;
                case 'usemtl': // Use a specific material for subsequent faces
                    currentMaterial = parts[1];
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
     * Retrieves all vertices of a specific object as a flat Float32Array.
     * @param {string} objectName - The name of the object to retrieve vertices for.
     * @returns {Float32Array} The array of vertices.
     */
    getVertices(objectName) {
        const vertices = [];
        for (let face of this.objects[objectName].faces) {
            for (let vertex of face) {
                const vi = vertex.vertexIndex;
                vertices.push(
                    this.vertices[vi * 3],
                    this.vertices[vi * 3 + 1],
                    this.vertices[vi * 3 + 2]
                );
            }
        }
        return new Float32Array(vertices);
    }

    /**
     * Retrieves all texture coordinates of a specific object as a flat Float32Array.
     * @param {string} objectName - The name of the object to retrieve texture coordinates for.
     * @returns {Float32Array} The array of texture coordinates.
     */
    getTexCoords(objectName) {
        const texCoords = [];
        for (let face of this.objects[objectName].faces) {
            for (let vertex of face) {
                if (vertex.texCoordIndex !== -1) {
                    const ti = vertex.texCoordIndex;
                    texCoords.push(
                        this.texCoords[ti * 2],
                        this.texCoords[ti * 2 + 1]
                    );
                } else {
                    texCoords.push(0, 0);
                }
            }
        }
        return new Float32Array(texCoords);
    }

    /**
     * Retrieves all normals of a specific object as a flat Float32Array.
     * @param {string} objectName - The name of the object to retrieve normals for.
     * @returns {Float32Array} The array of normals.
     */
    getNormals(objectName) {
        const normals = [];
        for (let face of this.objects[objectName].faces) {
            for (let vertex of face) {
                if (vertex.normalIndex !== -1) {
                    const ni = vertex.normalIndex;
                    normals.push(
                        this.normals[ni * 3],
                        this.normals[ni * 3 + 1],
                        this.normals[ni * 3 + 2]
                    );
                } else {
                    normals.push(0, 1, 0);
                }
            }
        }
        return new Float32Array(normals);
    }

    /**
     * Retrieves all indices for rendering triangles of a specific object as a Uint16Array.
     * @param {string} objectName - The name of the object to retrieve indices for.
     * @returns {Uint16Array} The array of indices.
     */
    getIndices(objectName) {
        const indices = [];
        let index = 0;
        for (let face of this.objects[objectName].faces) {
            for (let i = 1; i < face.length - 1; i++) {
                indices.push(index, index + i, index + i + 1);
            }
            index += face.length;
        }
        return new Uint16Array(indices);
    }

    /**
     * Retrieves all materials of a specific object as a flat Float32Array.
     * @param {string} objectName - The name of the object to retrieve materials for.
     * @returns {Float32Array} The array of material properties.
     */
    getMaterials(objectName) {
        const materials = [];
        for (let face of this.objects[objectName].faces) {
            for (let vertex of face) {
                if (vertex.material && this.materials[vertex.material]) {
                    const material = this.materials[vertex.material];
                    materials.push(
                        parseFloat(material.Kd[0]),
                        parseFloat(material.Kd[1]),
                        parseFloat(material.Kd[2]),
                        parseFloat(material.Ks[0]),
                        parseFloat(material.Ks[1]),
                        parseFloat(material.Ks[2]),
                        parseFloat(material.Ns),
                        parseFloat(material.illum),
                        material.diffuse_texture || -1,
                        material.normal_texture || -1,
                        material.specular_texture || -1
                    );
                } else {
                    // Default material if none is specified
                    materials.push(
                        0.8, 0.8, 0.8,  // Default Kd
                        0.5, 0.5, 0.5,  // Default Ks
                        32.0,           // Default Ns
                        2.0,            // Default illum
                        -1, -1, -1      // No textures by default
                    );
                }
            }
        }
        return new Float32Array(materials);
    }

    /**
     * @returns {Array<string>} the list of object names, the parts that compose the object.
     */
    getObjectNames() {
        return Object.keys(this.objects);
    }
}
