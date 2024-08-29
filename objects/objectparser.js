/**
 * ObjectParser
 * A class to parse 3D model data from OBJ and MTL files. It extracts vertices, normals, texture coordinates, and material information.
 */
class ObjectParser {
    /**
     * Creates a new ObjectParser instance and parses the given OBJ and MTL strings.
     * @param {string} objString - The content of the OBJ file as a string.
     * @param {string} mtlString - The content of the MTL file as a string.
     */
    constructor(objString, mtlString) {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.faces = [];
        this.materials = {};
        this.#parseOBJ(objString);
        this.#parseMTL(mtlString);
    }

    /**
     * Parses the MTL (material) string and stores material properties.
     * @param {string} text - The content of the MTL file as a string.
     * @private
     */
    #parseMTL(text) {
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
                    this.materials[currentMtlName]["diffuse_texture"] = parts[1];
                    break;
                case 'bump':
                case 'map_Bump':
                    this.materials[currentMtlName]["normal_texture"] = parts[1];
                    break;
                case 'map_Ks':
                    this.materials[currentMtlName]["specular_texture"] = parts[1];
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
            if (parts.length == 0) continue;

            switch (parts[0]) {
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
                this.faces.push(face);
                    break;
                case 'usemtl': // Use a specific material for subsequent faces
                    currentMaterial = parts[1];
                    break;
                case "#": // Comment
                case 'mtllib': // Reference to material file (ignored here)
                case 'o': // Object name (ignored)
                case 's': // Smoothing group (ignored, TODO for future implementation)
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
        const vertices = [];
        for (let face of this.faces) {
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
     * Retrieves all texture coordinates as a flat Float32Array.
     * If a vertex doesn't have texture coordinates, it defaults to (0, 0).
     * @returns {Float32Array} The array of texture coordinates.
     */
    getTexCoords() {
        const texCoords = [];
        for (let face of this.faces) {
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
     * Retrieves all normals as a flat Float32Array.
     * If a vertex doesn't have a normal, it defaults to (0, 1, 0).
     * @returns {Float32Array} The array of normals.
     */
    getNormals() {
        const normals = [];
        for (let face of this.faces) {
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
     * Retrieves all indices for rendering triangles as a Uint16Array.
     * @returns {Uint16Array} The array of indices.
     */
    getIndices() {
        const indices = [];
        let index = 0;
        for (let face of this.faces) {
            for (let i = 1; i < face.length - 1; i++) {
                indices.push(index, index + i, index + i + 1);
            }
            index += face.length;
        }
        return new Uint16Array(indices);
    }

    /**
     * Retrieves all materials as a flat Float32Array.
     * Each material includes Kd (diffuse color), Ks (specular color), and Ns (shininess).
     * @returns {Float32Array} The array of material properties.
     */
    getMaterials() {
        const materials = [];
        for (let face of this.faces) {
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
                        material.illum
                    );
                } else {
                    // Default material if none is specified
                    materials.push(
                        0.8, 0.8, 0.8,  // Default Kd
                        0.5, 0.5, 0.5,  // Default Ks
                        32.0            // Default Ns
                    );
                }
            }
        }
        return new Float32Array(materials);
    }
}
