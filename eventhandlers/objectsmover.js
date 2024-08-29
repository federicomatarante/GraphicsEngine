/**
 * ObjectsMover Class
 * 
 * This class manages the state of the object currently being moved in the 3D engine. 
 * It tracks which object is selected for movement and provides methods to set, remove, 
 * and check the presence of the moving object.
 */
class ObjectsMover {

    /**
     * Constructor for the ObjectsMover class.
     * Initializes with no object set for movement.
     */
    constructor() {
        this.movingObject = null;
    }

    /**
     * Sets the object to be moved.
     * @param {RenderObject} movingObject - The object that is to be moved.
     */
    set(movingObject) {
        this.movingObject = movingObject;
    }

    /**
     * Removes the current moving object, indicating that no object is being moved.
     */
    remove() {
        this.movingObject = null;
    }

    /**
     * Checks if there is an object currently set for movement.
     * @returns {boolean} - Returns true if an object is set for movement, otherwise false.
     */
    isPresent() {
        return this.movingObject !== null;
    }

    /**
     * Gets the current object set for movement.
     * @returns {RenderObject|null} - The object being moved, or null if no object is set.
     */
    get() {
        return this.movingObject;
    }
}
