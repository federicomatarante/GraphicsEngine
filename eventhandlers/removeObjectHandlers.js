/**
 * RemoveObjectHandlers Class
 * 
 * This class handles the removal of objects from the 3D engine. It manages the logic for 
 * detaching an object from the scene and updating the associated UI elements, such as 
 * removing the corresponding menu item.
 */
class RemoveObjectHandlers {

    /**
     * Constructor for the RemoveObjectHandlers class.
     * @param {GraphicsEngine} engine - The 3D engine from which objects will be removed.
     * @param {ObjectsMover} objectsMover - Manages the object currently being moved, ensuring it's properly deselected before removal.
     */
    constructor(engine, objectsMover,moveObjectsHandler) {
        this.engine = engine;
        this.objectsMover = objectsMover;
        this.moveObjectsHandler = moveObjectsHandler;

    
    }

    /**
     * Removes the object from the engine and updates the menu UI.
     * This method is triggered when the associated remove button is clicked.
     */
    #remove(menuItem,menuList,renderObject) {
        if(this.objectsMover.isPresent()){
            const object = this.objectsMover.get();
            if(object == renderObject){
                this.objectsMover.remove();
                this.moveObjectsHandler.finishMove();
            }
        }
        this.engine.remove(renderObject);
        menuList.removeChild(menuItem);
        this.engine.render();
    }

    /**
     * Registers the remove button with the handler for the specified object.
     * Binds the button's click event to the removal process of the render object and its menu item.
     * @param {HTMLButtonElement} removeBtn - The button that triggers the removal of the object.
     * @param {RenderObject} renderObject - The object to be removed from the scene.
     * @param {HTMLLIElement} menuItem - The menu item associated with the render object.
     * @param {HTMLUListElement} menuList - The parent list containing all menu items.
     */
    register(removeBtn, renderObject, menuItem, menuList) {
        removeBtn.addEventListener('click',() => this.#remove(menuItem,menuList,renderObject));
    }
}
