/**
 * Loads shader content from a specified URL.
 * @param {string} url - The URL of the shader file to load.
 * @returns {Promise<string>} A promise that resolves with the text content of the shader.
 */
async function loadShader(url) {
    const response = await fetch(url);
    return response.text();
}

/**
 * Creates and compiles a WebGL shader.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {number} type - The type of shader (vertex or fragment).
 * @param {string} source - The shader source code.
 * @returns {WebGLShader|null} The compiled shader, or null if compilation fails.
 */
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const stype = type == gl.VERTEX_SHADER ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER';
        console.error('Shader compilation error for shader of type ' + stype + ": ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

/**
 * Creates a WebGL program by linking vertex and fragment shaders.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLShader} vertexShader - The compiled vertex shader.
 * @param {WebGLShader} fragmentShader - The compiled fragment shader.
 * @returns {WebGLProgram|null} The created WebGL program, or null if linking fails.
 */
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    
    return program;
}

/**
 * Initializes WebGL by loading shaders, creating them, and creating a WebGL program.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {string} vertexShaderFile - The URL of the vertex shader file.
 * @param {string} fragmentShaderFile - The URL of the fragment shader file.
 * @returns {Promise<WebGLProgram|null>} A promise that resolves with the created WebGL program, or null if an error occurs.
 */
async function initWebGL(gl, vertexShaderFile, fragmentShaderFile) {
    let vertexShaderSource, fragmentShaderSource;
    // Shaders initialization
    try {
        vertexShaderSource = await loadShader(vertexShaderFile);
        fragmentShaderSource = await loadShader(fragmentShaderFile);
    } catch (error) {
        console.error('Error loading shaders:', error.message);
        process.exit(1);
    }

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Program creation
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    
    return program;
}