/**
 * WebGLRenderer Class
 * 
 * This class handles the low-level rendering operations for 3D objects in WebGL.
 * It manages buffer initialization, texture setup, and object rendering.
 * The GraphicsEngine class uses this class to perform actual rendering tasks.
 */
class WebGLRenderer {
    /**
     * Constructor for the WebGLRenderer class.
     * @param {WebGLRenderingContext} gl - The WebGL rendering context.
     * @param {WebGLProgram} program - The compiled WebGL program (shader program).
     * @description Initializes the WebGLRenderer with the provided context and shader program.
     */
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.buffers = new Map();
    }

    /**
     * Initializes buffers for a render object.
     * @param {Object} renderObject - The object to render.
     * @description Sets up WebGL buffers and textures for the specified render object.
     */
    initBuffers(renderObject) {
        const buffer = new WebGLBuffer(this.gl);
        const triangles = renderObject.getTriangles();
        const textures = renderObject.getTextures();
        const partialTextures = renderObject.getPartialTextures();

        buffer.setUpMeshes(triangles);
        buffer.setUpTextures(textures);
        buffer.setUpPartialTextures(partialTextures);
        buffer.setUpMaterials(renderObject.getMaterials());

        const indexInformation = renderObject.getParts().map(part => part.getIndexInfo());
        buffer.setUpIndexInformation(indexInformation);

        this.buffers.set(renderObject, buffer);
    }

    /**
     * Refreshes the buffers for a render object.
     * @param {Object} renderObject - The object to refresh.
     * @description Updates the buffers for a render object, typically after its state or position changes.
     */
    refreshBuffers(renderObject) {
        this.buffers.delete(renderObject);
        this.initBuffers(renderObject);
    }

    /**
     * Renders a single object.
     * @param {Object} buffer - The buffer containing object data.
     * @param {Object} renderParams - Parameters required for rendering, such as matrices and light data.
     * @description Uses the provided buffer and rendering parameters to draw a single object.
     */
    renderObject(buffer, renderParams) {
        const gl = this.gl;
        gl.useProgram(this.program);
        const binder = new WebGLBinder(this.program, gl);

        // Setting up triangles and textures
        binder.bindPositions(buffer.positionsBuffer);
        binder.bindTextureCoordinates(buffer.texCoordBuffer);
        binder.bindNormals(buffer.normalBuffer);
        binder.bindDiffuseTexture(buffer.diffuseTexture, renderParams.objectsColor);
        binder.bindNormalTexture(buffer.normalTexture);
        binder.bindSpecularTexture(buffer.specularTexture);
        binder.initializePartialTextures(buffer.partialTextures.length);
        binder.bindInvertTextureCoordsFlag(buffer.invertTextureCoords);
        

        buffer.partialTextures.forEach((texture, i) => {
            binder.bindPartialTextures(texture, i);
        });

        binder.bindMaterials(buffer.materials);
        binder.bindMaterialsIndices(buffer.materialsIndexBuffer);

        // Setting up view matrices
        binder.bindViewMatrices(renderParams.modelMatrix,renderParams.projectionMatrix, renderParams.modelViewMatrix, renderParams.normalMatrix);
        binder.bindCameraPosition(renderParams.cameraPosition);

        // Setting up light information
        binder.bindLight(renderParams.light);

        // Binding indices for triangles and rendering
        binder.bindIndices(buffer.indexBuffer);

        let trianglesOffset = 0;
        buffer.indexInformation.forEach(indexInfo => {
            if (indexInfo.indexLenght > 0) {
                gl.drawElements(gl.TRIANGLES, indexInfo.indexLenght, gl.UNSIGNED_INT, trianglesOffset * 4);
                trianglesOffset += indexInfo.indexLenght;
            }
        });

        // Binding indices for lines and rendering
        binder.bindIndices(buffer.lineIndexBuffer);

        let linesOffset = 0;
        buffer.indexInformation.forEach(indexInfo => {
            if (indexInfo.lineIndexLenght > 0) {
                gl.drawElements(gl.LINES, indexInfo.lineIndexLenght, gl.UNSIGNED_INT, linesOffset * 4);
                linesOffset += indexInfo.lineIndexLenght;
            }
        });
    }

    /**
     * Renders all objects in the engine.
     * @param {Object} renderParams - Parameters required for rendering, such as matrices and light data.
     * @description Clears the canvas and renders all objects using the provided rendering parameters.
     */
    renderAll(renderParams) {
        const gl = this.gl;

        // Clearing canvas
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        const bc = renderParams.backgroundColor;
        gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Rendering all the objects
        this.buffers.forEach(buffer => {
            this.renderObject(buffer, renderParams);
        });
    }

    /**
     * Removes the buffer for a given render object.
     * @param {Object} renderObject - The object whose buffer should be removed.
     * @description Deletes the buffer associated with the specified render object.
     */
    removeBuffer(renderObject) {
        this.buffers.delete(renderObject);
    }
}
