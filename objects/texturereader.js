/**
 * TextureReader Class
 * A class for reading and loading texture files.
 */
class TextureReader {

    /**
     * Creates an instance of TextureReader with the specified texture file URL.
     * @param {string} textureFile - The URL of the texture file to read.
     */
    constructor(textureFile) {
        this.textureFile = textureFile; 
    }

    /**
     * Reads the texture file and creates an object URL for it.
     * @param {string} url - The URL of the texture file.
     * @returns {Promise<string>} A promise that resolves with the object URL of the texture file.
     * @private
     */
    async #readTextureFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob(); 
            return URL.createObjectURL(blob); 
        } catch (error) {
            console.error(`Error reading texture file ${url}:`, error); 
            throw error; 
        }
    }

    /**
     * Reads and loads the texture file, returning an Image object when done.
     * @returns {Promise<Image>} A promise that resolves with an Image object of the loaded texture.
     */
    async read() {
        try {
            const [texture] = await Promise.all([
                this.#readTextureFile(this.textureFile),
            ]);
            const textureImg = new Image();

            return new Promise((resolve, reject) => {
                textureImg.onload = () => {
                    resolve(textureImg);
                };
                textureImg.onerror = () => {
                    reject(new Error("Errore nel caricamento dell'immagine."));
                };

                textureImg.src = texture;
            });

        } catch (error) {
            console.error('Errore durante il caricamento della texture:', error); // Log any errors encountered.
            throw error;
        }
    }
}
