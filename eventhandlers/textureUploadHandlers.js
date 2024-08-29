/**
 * TextureUploadHandlers Class
 * 
 * This class manages the uploading and application of textures (diffuse, specular, and normal) to 3D objects within the engine.
 * It creates a file input dynamically to allow users to select and upload image files, which are then processed and applied to the objects.
 */
class TextureUploadHandlers {

    /**
     * Constructor for the TextureUploadHandlers class.
     * @param {GraphicsEngine} engine - The 3D engine where the textures will be applied.
     */
    constructor(engine) {
        this.engine = engine;
    }

    /**
     * Handles the texture upload process.
     * It creates a file input, reads the selected file, processes it as a texture, 
     * and applies it to the specified object based on the texture type (diffuse, specular, or normal).
     * @param {string} type - The type of texture to be applied ('diffuse', 'specular', 'normal').
     * @param {RenderObject} renderObject - The object to which the texture will be applied.
     */
    #handleTextureUpload(type, renderObject) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async () => {
                const textureContent = reader.result;
                const textureReader = new TextureReader(textureContent);
                const texture = await textureReader.read();
                switch (type) {
                    case 'diffuse':
                        renderObject.setDiffuseTexture(texture);
                        break;
                    case 'specular':
                        renderObject.setSpecularTexture(texture);
                        break;
                    case 'normal':
                        renderObject.setNormalTexture(texture);
                        break;
                }
                this.engine.refresh(renderObject);
                this.engine.render();
            };

            reader.onerror = () => {
                console.error('Error reading the texture file:', reader.error);
            };

            reader.readAsDataURL(file);
        });

        fileInput.click();
    }

    /**
     * Registers the texture upload handlers for the diffuse, normal, and specular texture buttons.
     * Associates each button with its corresponding texture upload process.
     * @param {HTMLButtonElement} diffuseBtn - Button to trigger diffuse texture upload.
     * @param {HTMLButtonElement} normalBtn - Button to trigger normal texture upload.
     * @param {HTMLButtonElement} specularBtn - Button to trigger specular texture upload.
     * @param {RenderObject} renderObject - The object to which the textures will be applied.
     */
    register(diffuseBtn, normalBtn, specularBtn, renderObject) {
        diffuseBtn.addEventListener('click', () => this.#handleTextureUpload('diffuse', renderObject));
        normalBtn.addEventListener('click', () => this.#handleTextureUpload('normal', renderObject));
        specularBtn.addEventListener('click', () => this.#handleTextureUpload('specular', renderObject));
    }
}
