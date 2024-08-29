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
     */
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.buffers = new Map();
    }

    /**
     * Initializes buffers for a render object.
     * @param {Object} renderObject - The object to render.
     */
    initBuffers(renderObject) {
        const buffer = new WebGLBuffer(this.gl);
        const triangles = renderObject.getTriangles();
        const textures = renderObject.getTextures();
        buffer.setUpMeshes(triangles);
        buffer.setUpTextures(textures);
        this.buffers.set(renderObject, buffer);
    }

    /**
     * Refreshes the buffers for a render object.
     * To use every time a renderObject state or position is modified.
     * @param {Object} renderObject - The object to refresh.
     */
    refreshBuffers(renderObject) {
        this.buffers.delete(renderObject);
        this.initBuffers(renderObject);
    }

    /**
     * Renders a single object.
     * @param {Object} buffer - The buffer containing object data.
     * @param {Object} renderParams - Parameters required for rendering, like matrices and light data.
     */
    renderObject(buffer, renderParams) {
        const gl = this.gl;
        gl.useProgram(this.program);
        const binder = new WebGLBinder(this.program, gl);

        // Setting up triangles and textures
        binder.bindPositions(buffer.positionsBuffer);
        binder.bindTextureCoordinates(buffer.texCoordBuffer);
        binder.bindNormals(buffer.normalBuffer);
        binder.bindIndices(buffer.indexBuffer);
        binder.bindMaterials(buffer.materialBuffer);
        binder.bindDiffuseTexture(buffer.diffuseTexture, renderParams.objectsColor);
        binder.bindNormalTexture(buffer.normalTexture);
        binder.bindSpecularTexture(buffer.specularTexture);

        // Setting up view matrices
        binder.bindViewMatrices(renderParams.projectionMatrix, renderParams.modelViewMatrix, renderParams.normalMatrix);
        binder.bindCameraPosition(renderParams.cameraPosition);

        // Setting up light information
        binder.bindLight(renderParams.light);

        // Draw the triangles
        gl.drawElements(gl.TRIANGLES, buffer.trianglesNumber, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Renders all objects in the engine.
     * @param {Object} renderParams - Parameters required for rendering, like matrices and light data.
     */
    renderAll(renderParams) {
        const gl = this.gl;

        // Clearing canvas
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        const bc = renderParams.backgroundColor;
        gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Rendering all the objects
        for (const buffer of this.buffers.values()) {
            this.renderObject(buffer, renderParams);
        }
    }

    /**
     * Removes the buffer for a given render object.
     * @param {Object} renderObject - The object whose buffer should be removed.
     */
    removeBuffer(renderObject) {
        this.buffers.delete(renderObject);
    }
}
