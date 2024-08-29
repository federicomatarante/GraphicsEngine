/**
 * MoveObjectHandlers Class
 * 
 * This class manages the controls for moving and rotating objects in a 3D engine.
 * It allows continuous translation and rotation of selected objects via UI controls
 * and handles user interactions such as mouse events to start and stop actions.
 */
class MoveObjectHandlers {

    /**
     * Constructor for the MoveObjectHandlers class.
     * @param {GraphicsEngine} engine - The 3D engine where objects are manipulated and rendered.
     * @param {ObjectsMover} objectsMover - Handles the selection and movement of objects in the scene.
     */
    constructor(engine, objectsMover) {
        this.objectsMover = objectsMover;
        this.engine = engine;
        this.moveControlsMenu = document.getElementById('moveControlsMenu');
        this.currentInterval = null;
        this.setupMoveControls();
        this.delta = 0.005;
    }

    /**
     * Sets up event listeners for the movement and rotation controls.
     * Each control triggers a continuous action while the mouse button is pressed.
     * @private
     */
    setupMoveControls() {
        const controls = {
            translateXPlus: () => this.startContinuousAction(() => this.translate(1, 0, 0)),
            translateXMinus: () => this.startContinuousAction(() => this.translate(-1, 0, 0)),
            translateYPlus: () => this.startContinuousAction(() => this.translate(0, 1, 0)),
            translateYMinus: () => this.startContinuousAction(() => this.translate(0, -1, 0)),
            translateZPlus: () => this.startContinuousAction(() => this.translate(0, 0, 1)),
            translateZMinus: () => this.startContinuousAction(() => this.translate(0, 0, -1)),
            rotateXPlus: () => this.startContinuousAction(() => this.rotate(1, 0, 0)),
            rotateXMinus: () => this.startContinuousAction(() => this.rotate(-1, 0, 0)),
            rotateYPlus: () => this.startContinuousAction(() => this.rotate(0, 1, 0)),
            rotateYMinus: () => this.startContinuousAction(() => this.rotate(0, -1, 0)),
            rotateZPlus: () => this.startContinuousAction(() => this.rotate(0, 0, 1)),
            rotateZMinus: () => this.startContinuousAction(() => this.rotate(0, 0, -1)),
        };

        Object.keys(controls).forEach(id => {
            const controlButton = document.getElementById(id);
            controlButton.addEventListener('mousedown', controls[id]);
            controlButton.addEventListener('mouseup', () => this.stopContinuousAction());
            controlButton.addEventListener('mouseleave', () => this.stopContinuousAction());
        });

        document.getElementById('resetTransformations').addEventListener('click', () => this.resetTransformations());
        document.getElementById('teleportHere').addEventListener('click', () => this.teleportHere());
        document.getElementById('finishMove').addEventListener('click', () => this.finishMove());
    }

    /**
     * Starts a continuous action, such as translating or rotating an object.
     * The action is executed repeatedly at a fixed interval.
     * @param {Function} action - The action to be executed continuously.
     * @private
     */
    startContinuousAction(action) {
        this.currentInterval = setInterval(action, 10);
    }

    /**
     * Stops the currently running continuous action.
     * Clears the interval and stops further execution.
     * @private
     */
    stopContinuousAction() {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
            this.delta = 0.005;
        }
    }

    /**
     * Translates the selected object by the specified amounts in the x, y, and z directions.
     * @param {number} x - The amount to translate in the x direction.
     * @param {number} y - The amount to translate in the y direction.
     * @param {number} z - The amount to translate in the z direction.
     */
    translate(x, y, z) {
        x = x*this.delta; y=y*this.delta; z=z*this.delta;
        if (this.objectsMover.isPresent()) {
            const object = this.objectsMover.get();
            object.move(new Vector3D(x, y, z));
            this.engine.refresh(object);
            this.engine.render();
            this.delta = this.delta <= 0.2  ? this.delta*1.1 :  0.2;
        }
    }

    /**
     * Rotates the selected object by the specified amounts around the x, y, and z axes.
     * @param {number} x - The amount to rotate around the x-axis.
     * @param {number} y - The amount to rotate around the y-axis.
     * @param {number} z - The amount to rotate around the z-axis.
     */
    rotate(x, y, z) {
        x = x*this.delta; y=y*this.delta; z=z*this.delta;
        if (this.objectsMover.isPresent()) {
            const object = this.objectsMover.get();
            object.rotate(x, y, z);
            this.engine.refresh(object);
            this.engine.render();
            this.delta = this.delta <= 0.2  ? this.delta*1.1 : 0.2;
        }
    }

    /**
     * Teleports the object in the camera position.
     */
    teleportHere(){
        if (this.objectsMover.isPresent()) {
            const object = this.objectsMover.get();
            const cameraPosition = this.engine.getCameraPosition();
            object.setPosition(cameraPosition);
            this.engine.refresh(object);
            this.engine.render();
        }
    }

    /**
     * Resets all transformations applied to the selected object.
     * The object returns to its original position, rotation, and scale.
     */
    resetTransformations() {
        if (this.objectsMover.isPresent()) {
            const object = this.objectsMover.get();
            object.resetTransformations();
            this.engine.refresh(object);
            this.engine.render();
        }
    }

    /**
     * Handles the selection of an object to be moved.
     * Displays the move controls and disables other move buttons while an object is selected.
     * @param {Object} renderObject - The object to be moved.
     * @private
     */
    #handleMoveObject(renderObject) {
        const moveButtons = document.querySelectorAll('#menu button.move-btn');

        if (this.objectsMover.isPresent()) {
            this.finishMove();
        } else {
            this.objectsMover.set(renderObject);
            this.moveControlsMenu.style.display = 'block';
            moveButtons.forEach(btn => {
                btn.disabled = true;
            });
        }
    }

    /**
     * Finishes the move action for the current object.
     * Hides the move controls and re-enables the move buttons.
     */
    finishMove() {
        this.objectsMover.remove();
        this.moveControlsMenu.style.display = 'none';
        document.querySelectorAll('#menu button.move-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    /**
     * Registers an object and its associated move button to enable movement controls.
     * @param {HTMLElement} moveBtn - The button that initiates the move action for the object.
     * @param {Object} renderObject - The object to be moved.
     */
    register(moveBtn, renderObject) {
        moveBtn.addEventListener('click', () => {
            this.#handleMoveObject(renderObject);
        });
    }
}
