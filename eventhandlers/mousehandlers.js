/**
 * MouseHandlers Class
 * 
 * This class handles mouse interactions for the 3D engine, including object movement, 
 * camera rotation, and camera translation based on mouse input. It manages dragging events 
 * for both left and right mouse buttons and mouse wheel scrolling for zooming.
 */
class MouseHandlers {

    /**
     * Constructor for the MouseHandlers class.
     * @param {GraphicsEngine} engine - The 3D engine where objects and camera are manipulated.
     * @param {ObjectsMover} objectsMover - Handles the movement of objects in the scene.
     */
    constructor(engine) {
        this.isDraggingL = false;
        this.isDraggingR = false;
        this.mousePosition = null;
        this.engine = engine;

        // Bind methods to the class instance
        this.handleMouseDown = this.#handleMouseDown.bind(this);
        this.handleMouseUp = this.#handleMouseUp.bind(this);
        this.handleMouseMove = this.#handleMouseMove.bind(this);
        this.handleMouseWheel = this.#handleMouseWheel.bind(this);
    }

    /**
     * Handles the mouse down event.
     * Initializes dragging based on the mouse button pressed.
     * @param {MouseEvent} event - The mouse down event.
     * @private
     */
    #handleMouseDown(event) {
        if (event.button === 0) { // Left mouse button
            this.isDraggingL = true;
            this.mousePosition = new Vector3D(event.clientX, event.clientY);
        } else if (event.button === 1) { // Middle mouse button
            this.isDraggingR = true;
            this.mousePosition = new Vector3D(event.clientX, event.clientY);
        }
    }

    /**
     * Handles the mouse up event.
     * Stops dragging when the mouse button is released.
     * @private
     */
    #handleMouseUp() {
        if (this.isDraggingL || this.isDraggingR) {
            this.isDraggingL = false;
            this.isDraggingR = false;
        }
    }

    /**
     * Handles the mouse move event.
     * Rotates or traslates the camera or moves an object based on dragging direction.
     * @param {MouseEvent} event - The mouse move event.
     * @private
     */
    #handleMouseMove(event) {
        if (!(this.isDraggingL || this.isDraggingR)) {
            return;
        }

        const newPosition = new Vector3D(event.clientX, event.clientY);
        const direction = newPosition.subtract(this.mousePosition).normalize();
        this.mousePosition = newPosition;

        if (this.isDraggingL) {
            const rotationMatrix = this.engine.getRotationAroundCamera(direction,Math.PI / 90);
            this.engine.rotateCamera(rotationMatrix);
        } else {
            const invertedDirection = new Vector3D(direction.x,-direction.y,0);
            const transformedDirection = this.engine.getDirectionInSpace(invertedDirection);
            this.engine.traslateCamera(transformedDirection);
        }
        this.engine.render();
    }

    /**
     * Handles the mouse wheel event.
     * Zooms the camera in or out based on the scroll direction.
     * @param {WheelEvent} event - The mouse wheel event.
     * @private
     */
    #handleMouseWheel(event) {
        const direction = this.engine.cameraPosition.subtract(this.engine.lookAtPosition).normalize();
        this.engine.moveCamera(direction.scale(Math.sign(event.deltaY)));
        this.engine.render();
    }

    /**
     * Registers the mouse event handlers to the specified canvas.
     * @param {HTMLCanvasElement} canvas - The canvas element to attach the handlers to.
     */
    register(canvas) {
        canvas.addEventListener('mousedown', this.handleMouseDown);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseup', this.handleMouseUp);
        canvas.addEventListener('wheel', this.handleMouseWheel);
    }
}
