/**
 * Handles interactions with the light settings in a 3D graphics application.
 * This class manages the UI for adjusting light properties such as color and strength,
 * and updating these settings in the GraphicsEngine instance.
 */
class LightSettingsHandlers {
    /**
     * Constructs an instance of LightSettingsHandlers.
     * @param {GraphicsEngine} engine - The 3D graphics engine used to apply light settings.
     */
    constructor(engine) {
        this.engine = engine;

        // UI elements for light settings
        this.lightSettingsButton = null;
        this.closeLightSettingsButton = null;
        this.lightColorInput = null;
        this.ambientLightColorInput = null;
        this.ambientLightStrengthInput = null;
        this.setLightPositionButton = null;
        this.lightSettingsOverlay = null;
        this.lightSettingsModal = null;

        // Bind methods to ensure proper context
        this.openLightSettings = this.openLightSettings.bind(this);
        this.closeLightSettings = this.closeLightSettings.bind(this);
        this.setLightPosition = this.setLightPosition.bind(this);
        this.setLightColor = this.setLightColor.bind(this);
        this.setAmbientColor = this.setAmbientColor.bind(this);
        this.setAmbientLightStrength = this.setAmbientLightStrength.bind(this);
    }

    /**
     * Converts an array of normalized RGB values to a hexadecimal color string.
     * @param {Array<number>} rgb - Array of RGB values, each between 0 and 1.
     * @returns {string} The color in hexadecimal format (e.g., "#ff0000").
     * @private
     */
    #rgbToHex(rgb) {
        return '#' + rgb.map(x => {
            x = Math.round(x * 255);
            return x.toString(16).padStart(2, '0');
        }).join('');
    }

    /**
     * Converts a hexadecimal color string to an array of normalized RGB values.
     * @param {string} hex - The color in hexadecimal format (e.g., "#ff0000").
     * @returns {Array<number>} Array of RGB values, each between 0 and 1.
     * @private
     */
    #hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        return [
            (bigint >> 16) / 255,
            ((bigint >> 8) & 0x00FF) / 255,
            (bigint & 0x0000FF) / 255
        ];
    }

    /**
     * Opens the light settings modal and populates inputs with current light settings.
     */
    openLightSettings() {
        this.lightSettingsOverlay.style.display = 'block';
        this.lightSettingsModal.style.display = 'block';

        // Populate inputs with current light settings from the engine
        this.lightColorInput.value = this.#rgbToHex(this.engine.getLightColor().elements);
        this.ambientLightColorInput.value = this.#rgbToHex(this.engine.getAmbientLightColor().elements);
        this.ambientLightStrengthInput.value = this.engine.getAmbientLightStrength();
    }

    /**
     * Closes the light settings modal.
     */
    closeLightSettings() {
        this.lightSettingsOverlay.style.display = 'none';
        this.lightSettingsModal.style.display = 'none';
    }

    /**
     * Updates the main light color based on the input value.
     */
    setLightColor() {
        const color = this.#hexToRgb(this.lightColorInput.value);
        this.engine.setLightColor(Vector3D.fromArray(color));
        this.engine.render();
    }

    /**
     * Updates the ambient light color based on the input value.
     */
    setAmbientColor() {
        const ambientColor = this.#hexToRgb(this.ambientLightColorInput.value);
        this.engine.setAmbientLightColor(Vector3D.fromArray(ambientColor));
        this.engine.render();
    }

    /**
     * Updates the ambient light strength based on the input value.
     */
    setAmbientLightStrength() {
        const ambientStrength = parseFloat(this.ambientLightStrengthInput.value);
        this.engine.setAmbientLightStrength(ambientStrength);
        this.engine.render();
    }

    /**
     * Sets the light position to the current camera position.
     */
    setLightPosition() {
        const position = this.engine.getCameraPosition();
        this.engine.setLightPosition(position);
        this.engine.render();
    }

    /**
     * Registers the UI elements and event listeners for the light settings.
     * @param {Object} parameters - An object containing references to UI elements.
     * @param {HTMLElement} parameters.lightSettingsButton - Button to open light settings.
     * @param {HTMLElement} parameters.closeLightSettingsButton - Button to close light settings.
     * @param {HTMLElement} parameters.lightColorInput - Input field for the main light color.
     * @param {HTMLElement} parameters.ambientLightColorInput - Input field for the ambient light color.
     * @param {HTMLElement} parameters.ambientLightStrengthInput - Input field for the ambient light strength.
     * @param {HTMLElement} parameters.setLightPositionButton - Button to set the light position.
     * @param {HTMLElement} parameters.lightSettingsOverlay - Overlay for light settings modal.
     * @param {HTMLElement} parameters.lightSettingsModal - Modal for light settings.
     */
    register(parameters) {
        this.lightSettingsButton = parameters.lightSettingsButton;
        this.closeLightSettingsButton = parameters.closeLightSettingsButton;
        this.lightColorInput = parameters.lightColorInput;
        this.ambientLightColorInput = parameters.ambientLightColorInput;
        this.ambientLightStrengthInput = parameters.ambientLightStrengthInput;
        this.setLightPositionButton = parameters.setLightPositionButton;
        this.lightSettingsOverlay = parameters.lightSettingsOverlay;
        this.lightSettingsModal = parameters.lightSettingsModal;

        // Add event listeners to the UI elements
        this.lightSettingsButton.addEventListener('click', this.openLightSettings);
        this.closeLightSettingsButton.addEventListener('click', this.closeLightSettings);
        this.lightColorInput.addEventListener('change', this.setLightColor);
        this.ambientLightColorInput.addEventListener('change', this.setAmbientColor);
        this.ambientLightStrengthInput.addEventListener('change', this.setAmbientLightStrength);
        this.setLightPositionButton.addEventListener('click', this.setLightPosition);
    }
}
