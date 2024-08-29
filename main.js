
/**
 * Registers event listeners and handlers for various UI elements and actions.
 * This function sets up the interactions between the UI and the GraphicsEngine.
 * 
 * @param {GraphicsEngine} engine - The 3D graphics engine instance used for rendering and managing objects.
 */
function registerListeners(engine) {
    // Create instances of handlers for different functionalities
    const objectsMover = new ObjectsMover();
    const mouseHandlers = new MouseHandlers(engine);
    const textureUploadHandlers = new TextureUploadHandlers(engine);
    const moveObjectHandlers = new MoveObjectHandlers(engine, objectsMover);
    const removeObjectHandlers = new RemoveObjectHandlers(engine, objectsMover,moveObjectHandlers);
    const addObjectHandlers = new AddObjectHandlers(engine, textureUploadHandlers, moveObjectHandlers, removeObjectHandlers, objectsMover);
    const settingsHandlers = new SettingsHandlers(engine);
    const lightSettingsHandlers = new LightSettingsHandlers(engine);

    // Get references to UI elements
    const canvas = document.getElementById('glcanvas');
    const addButton = document.getElementById('addButton');
    const objFileInput = document.getElementById('objFileInput');
    const mtlFileInput = document.getElementById('mtlFileInput');
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const objectColorPicker = document.getElementById('objectColorPicker');
    const resetViewButton = document.getElementById('resetViewButton');
    const setCameraCenterButton = document.getElementById('setCameraCenterButton');
    // Prepare parameters for light settings handlers
    const lightSettingsParameters = {
        lightSettingsButton: document.getElementById('lightSettingsButton'),
        closeLightSettingsButton: document.getElementById('closeLightSettings'),
        lightColorInput: document.getElementById('lightColor'),
        ambientLightColorInput: document.getElementById('ambientLightColor'),
        ambientLightStrengthInput: document.getElementById('ambientLightStrength'),
        setLightPositionButton: document.getElementById('setLightPositionButton'),
        lightSettingsOverlay: document.getElementById('lightSettingsOverlay'),
        lightSettingsModal: document.getElementById('lightSettingsModal')
    };

    // Register event listeners for mouse interactions and object management
    mouseHandlers.register(canvas);
    addObjectHandlers.register(addButton, objFileInput, mtlFileInput);
    settingsHandlers.register(backgroundColorPicker, objectColorPicker, resetViewButton,setCameraCenterButton);
    lightSettingsHandlers.register(lightSettingsParameters);
}

/**
 * Initializes the WebGL context and the GraphicsEngine, then sets up event listeners
 * and renders the initial scene.
 * 
 * This function handles the following tasks:
 * 1. Creates and configures the WebGL context.
 * 2. Initializes the GraphicsEngine with shaders.
 * 3. Registers event listeners and handlers.
 * 4. Renders the initial scene.
 * 
 * @returns {Promise<void>} A promise that resolves when initialization and rendering are complete.
 */
async function initializeAndRender() {
    const vertexShaderFile = "shaders/vertex.glsl";  // Path to the vertex shader file
    const fragmentShaderFile = "shaders/fragment.glsl";  // Path to the fragment shader file

    const canvas = document.getElementById('glcanvas');  // Get the canvas element
    const gl = canvas.getContext("webgl");  // Create a WebGL rendering context

    // Initialize the GraphicsEngine with the WebGL context and shader files
    const engine = new GraphicsEngine(gl, vertexShaderFile, fragmentShaderFile);
    await engine.init();  // Wait for the engine to initialize

    registerListeners(engine);  // Set up event listeners and handlers

    // Render the initial scene
    engine.render();
}

// Call the async function and handle any errors
initializeAndRender().catch(error => {
    console.error('Error initializing and rendering:', error);
});
