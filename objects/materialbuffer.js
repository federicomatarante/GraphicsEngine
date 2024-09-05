/**
 * Class representing a material buffer for storing material properties.
 * 
 * This class holds properties related to material appearance, such as color, shininess,
 * and textures used for rendering objects in WebGL.
 * 
 * @property {number[]} Kd - Diffuse color of the material.
 * @property {number[]} Ks - Specular color of the material.
 * @property {number[]} Ka - Ambient color of the material.
 * @property {number} Ns - Shininess of the material.
 * @property {number} illum - Illumination model used for the material.
 * @property {number} alpha - Alpha value (transparency) of the material.
 * @property {number} Ni - Optical density (refraction index) of the material.
 * @property {number[]} transmissionFilter - Transmission filter color.
 * @property {number[]} Ke - Emission color of the material.
 * @property {number} ambientTexture - ID of the ambient texture.
 * @property {number} diffuseTexture - ID of the diffuse texture.
 * @property {number} normalTexture - ID of the normal texture.
 * @property {number} specularTexture - ID of the specular texture.
 * @property {number} shininessTexture - ID of the shininess texture.
 * @property {number} emissionTexture - ID of the emission texture.
 */
class MaterialBuffer {
    /**
     * Create a MaterialBuffer instance.
     * @param {string} name - The name of the material.
     * @param {Object} [params={}] - Parameters for material properties.
     * @param {number[]} [params.Kd=[1.0, 1.0, 1.0]] - Diffuse color.
     * @param {number[]} [params.Ks=[1.0, 1.0, 1.0]] - Specular color.
     * @param {number[]} [params.Ka=[1.0, 1.0, 1.0]] - Ambient color.
     * @param {number} [params.Ns=32.0] - Shininess.
     * @param {number} [params.illum=2.0] - Illumination model.
     * @param {number} [params.alpha=1.0] - Alpha value (transparency).
     * @param {number} [params.Ni=1.0] - Optical density (refraction index).
     * @param {number[]} [params.transmissionFilter=[1.0, 1.0, 1.0]] - Transmission filter color.
     * @param {number[]} [params.Ke=[0.0, 0.0, 0.0]] - Emission color.
     * @param {number} [params.ambientTexture=-1.0] - Ambient texture ID.
     * @param {number} [params.diffuseTexture=-1.0] - Diffuse texture ID.
     * @param {number} [params.normalTexture=-1.0] - Normal texture ID.
     * @param {number} [params.specularTexture=-1.0] - Specular texture ID.
     * @param {number} [params.shininessTexture=-1.0] - Shininess texture ID.
     * @param {number} [params.emissionTexture=-1.0] - Emission texture ID.
     */
    constructor(name, {
        Kd = [1.0, 1.0, 1.0],           // Diffuse color
        Ks = [1.0, 1.0, 1.0],           // Specular color
        Ka = [1.0, 1.0, 1.0],           // Ambient color
        Ns = 32.0,                      // Shininess
        illum = 2.0,                    // Illumination model
        alpha = 1.0,                    // Alpha value (transparency)
        Ni = 1.0,                       // Optical density (refraction index)
        transmissionFilter = [1.0, 1.0, 1.0], // Transmission filter color
        Ke = [0.0, 0.0, 0.0],           // Emission color
        ambientTexture = -1.0,          // Ambient texture ID
        diffuseTexture = -1.0,          // Diffuse texture ID
        normalTexture = -1.0,           // Normal texture ID
        specularTexture = -1.0,         // Specular texture ID
        shininessTexture = -1.0,        // Shininess texture ID
        emissionTexture = -1.0          // Emission texture ID
    } = {}) {
        this.name = name;
        this.Kd = Kd;
        this.Ks = Ks;
        this.Ka = Ka;
        this.Ns = Ns;
        this.illum = illum;
        this.alpha = alpha;
        this.transmissionFilter = transmissionFilter;
        this.Ke = Ke;
        this.Ni = Ni;
        this.ambientTexture = ambientTexture;
        this.diffuseTexture = diffuseTexture;
        this.normalTexture = normalTexture;
        this.specularTexture = specularTexture;
        this.shininessTexture = shininessTexture;
        this.emissionTexture = emissionTexture;
    }
}
