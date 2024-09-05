/**
 * SettingsHandlers Class
 * 
 * This class manages the settings related to the background color, objects' color, 
 * and the reset view functionality in the 3D engine. It allows the user to pick colors 
 * and reset the camera view to its default position.
 */
class SettingsHandlers {

    /**
     * Constructor for the SettingsHandlers class.
     * @param {GraphicsEngine} engine - The 3D engine where the settings will be applied.
     */
    constructor(engine) {
        this.engine = engine;
        this.pickBackgroundColor = this.#pickBackgroundColor.bind(this);
        this.resetView = this.#resetView.bind(this);
        this.setCameraCenter = this.#setCameraCenter.bind(this);
    }

    /**
     * Converts a hex color value to an RGBA array.
     * @param {string} hex - The hex color value (e.g., "#FFFFFF").
     * @param {number} [alpha=1] - The alpha value for the color (default is 1).
     * @returns {number[]} - An array representing the color in RGBA format.
     * @private
     */
    #hexToRgba(hex, alpha = 1) {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
        return [r, g, b, alpha];
    }

    /**
     * Handles the selection of the background color.
     * Applies the selected color to the engine's background.
     * @param {Event} event - The event triggered by the color picker input.
     */
    #pickBackgroundColor(event) {
        const color = event.target.value;
        this.engine.setBackgroundColor(this.#hexToRgba(color));
        this.engine.render();
    }

    /**
     * Resets the view in the engine to the default camera position.
     */
    #resetView() {
        this.engine.resetView();
        this.engine.render();
    }

    /**
     * Sets the camera center in the current camera psoition.
     *
     */
    #setCameraCenter(){
        const cameraPosition = this.engine.getCameraPosition();
        this.engine.setCameraCenter(cameraPosition);
    }

    /**
     * Registers event listeners for the settings controls.
     * @param {HTMLInputElement} backgroundColorPicker - Input element for selecting the background color.
     * @param {HTMLInputElement} objectColorPicker - Input element for selecting the objects' color.
     * @param {HTMLButtonElement} resetViewButton - Button element to reset the camera view.
     */
    register(backgroundColorPicker, objectColorPicker, resetViewButton,setCameraCenterButton) {
        backgroundColorPicker.addEventListener('input', this.pickBackgroundColor);
+        resetViewButton.addEventListener('click', this.resetView);
        setCameraCenterButton.addEventListener('click', this.setCameraCenter);

    }
}
