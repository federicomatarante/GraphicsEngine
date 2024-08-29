/**
 * Vector Library
 * A collection of methods for vector calculations.
 */
class Vector3D { // TODO rename to Vector3D
    /**
     * Creates a new vector from the given components. Standard values are: (0,0,0)
     * @param {number} x - The x component of the vector.
     * @param {number} y - The y component of the vector.
     * @param {number} z - The z component of the vector.
     */
    constructor(x = 0, y = 0, z = 0) {
      this.elements = [x,y,z];
    }
  
    /**
     * Calculates the magnitude (length) of the vector.
     * @returns {number} The magnitude of the vector.
     */
    magnitude() {
      return Math.sqrt(this.elements[0] * this.elements[0] + this.elements[1] * this.elements[1] + this.elements[2] * this.elements[2]);
    }
  
    /**
     * Normalizes the vector to a unit vector.
     * @returns {Vector3D} A new vector containing the normalized vector.
     */
    normalize() {
      const len = this.magnitude();
      if (len === 0) return new Vector3D();
      return new Vector3D(this.elements[0] / len, this.elements[1] / len, this.elements[2] / len);
    }
  
    /**
     * Adds another vector to this vector component-wise.
     * @param {Vector3D} other - The vector to add.
     * @returns {Vector3D} A new vector containing the sum of the two vectors.
     */
    add(other) {
      return new Vector3D(this.elements[0] + other.x, this.elements[1] + other.y, this.elements[2] + other.z);
    }
  
    /**
     * Subtracts another vector from this vector component-wise.
     * @param {Vector3D} other - The vector to subtract.
     * @returns {Vector3D} A new vector containing the difference between the two vectors.
     */
    subtract(other) {
      return new Vector3D(this.elements[0] - other.x, this.elements[1] - other.y, this.elements[2] - other.z);
    }
  
    /**
     * Calculates the dot product of this vector and another vector.
     * @param {Vector3D} other - The other vector.
     * @returns {number} The dot product of the two vectors.
     */
    dot(other) {
      return this.elements[0] * other.x + this.elements[1] * other.y + this.elements[2] * other.z;
    }
  
    /**
     * Calculates the cross product of this vector and another vector.
     * @param {Vector3D} other - The other vector.
     * @returns {Vector3D} A new vector containing the cross product of the two vectors.
     */
    cross(other) {
      const x = this.y * other.z - this.z * other.y;
      const y = this.z * other.x - this.x * other.z;
      const z = this.x * other.y - this.y * other.x;
      return new Vector3D(x, y, z);
    }
  
    /**
     * Scales the vector by a scalar value.
     * @param {number} scalar - The scalar value.
     * @returns {Vector3D} A new vector containing the scaled vector.
     */
    scale(scalar) {
      return new Vector3D(this.elements[0] * scalar, this.elements[1] * scalar, this.elements[2] * scalar);
    }

    /**
     * Calculates the Euclidean distance between this vector and another vector.
     * @param {Vector3D} other - The other vector.
     * @returns {number} The Euclidean distance between the two vectors.
     */
    distance(other) {
      const dx = this.elements[0] - other.x;
      const dy = this.elements[1] - other.y;
      const dz = this.elements[2] - other.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }  
     
    /**
     * Calculates the angle (in radians) between this vector and another vector.
     * @param {Vector3D} other - The other vector.
     * @returns {number} The angle (in radians) between the two vectors.
     */
    angle(other) {
      const dotProd = this.dot(other);
      const magProd = this.magnitude() * other.magnitude();
      return magProd === 0 ? 0 : Math.acos(dotProd / magProd);
    }   

    /**
     * Calculates the projection of this vector onto another vector.
     * @param {Vector3D} other - The vector to project onto.
     * @returns {Vector3D} The projection of this vector onto the other vector.
     */
    project(other) {
      const otherNorm = other.normalize();
      const dotProd = this.dot(otherNorm);
      return otherNorm.scale(dotProd);
    }   

    /**
     * Calculates the reflection of this vector across another vector.
     * @param {Vector3D} normal - The vector to reflect across.
     * @returns {Vector3D} The reflection of this vector across the normal vector.
     */
    reflect(normal) {
      const projection = this.project(normal);
      return this.subtract(projection.scale(2));
    }

    /** 
     * @returns {number[]} The xyz coordinates of the vector as a 3L array.
    */
    getElements(){
      return this.elements;
    }

    /** 
     * @returns {int} The x coordinate of the vector.
    */
    get x(){
      return this.elements[0];
    }

    /** 
     * @returns {int} The y coordinate of the vector.
    */
    get y(){
      return this.elements[1];
    }

    /** 
     * @returns {int} The z coordinate of the vector.
    */
    get z(){
      return this.elements[2];
    }

    /**
     * Creates a new vector from an array.
     * @param {number[]} elems: a 3L array containing the XYZ coordinates of the vector.
     * @returns {Vector3D} the created vector.
     */
    static fromArray(elems){
      if (elems.length !== 3) {
        throw new Error('Array must contain exactly three elements.');
      }
      return new Vector3D(elems[0], elems[1], elems[2]);
    }
    
  }
