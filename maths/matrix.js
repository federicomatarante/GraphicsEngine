/**
 * Matrix Library
 * A collection of methods for matrix calculations, including basic operations, 
 * multiplication, transpose, and specialized transformations.
 */
class Matrix {
    /**
     * Creates a new matrix with the given number of rows and columns.
     * Optionally, initializes the matrix with provided elements.
     * @param {number} rows - The number of rows in the matrix.
     * @param {number} cols - The number of columns in the matrix.
     * @param {number[]} [elems=null] - Optional array of elements to initialize the matrix. Defaults to a zero-filled matrix.
     * @throws Will throw an error if rows or columns are not positive numbers.
     */
    constructor(rows, cols, elems = null) {
        if (typeof rows !== 'number' || typeof cols !== 'number' || rows <= 0 || cols <= 0) {
            throw new Error("Righe e colonne devono essere numeri positivi");
        }

        this.rows = rows;
        this.cols = cols;
        
        if (elems) {
            if (!Array.isArray(elems) || elems.length !== rows * cols) {
                throw new Error(`Gli elementi devono essere un array di lunghezza ${rows * cols}`);
            }
            this.elements = [...elems];
        } else {
            this.elements = new Array(rows * cols).fill(0);
        }
    }

    /**
     * Gets the element at the specified row and column.
     * @param {number} row - The row index of the element.
     * @param {number} col - The column index of the element.
     * @returns {number} The value of the element at the specified position.
     * @throws Will throw an error if the row or column index is invalid.
     */
    get(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.elements[row * this.cols + col];
        }
        throw new Error("Invalid row or column index");
    }

    /**
     * Sets the element at the specified row and column to a new value.
     * @param {number} row - The row index of the element.
     * @param {number} col - The column index of the element.
     * @param {number} value - The new value to set at the specified position.
     * @throws Will throw an error if the row or column index is invalid.
     */
    set(row, col, value) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.elements[row * this.cols + col] = value;
        } else {
            throw new Error("Invalid row or column index");
        }
    }

    /**
     * Gets the number of rows in the matrix.
     * @returns {number} The number of rows.
     */
    getRows() {
        return this.rows;
    }

    /**
     * Gets the number of columns in the matrix.
     * @returns {number} The number of columns.
     */
    getCols() {
        return this.cols;
    }

    /**
     * Gets all elements of the matrix as a flat array.
     * @returns {number[]} The elements of the matrix.
     */
    getElements() {
        return [...this.elements];
    }

    /**
     * Multiplies the matrix by another matrix.
     * @param {Matrix} other - The matrix to multiply with.
     * @returns {Matrix} A new matrix that is the result of the multiplication.
     * @throws Will throw an error if the argument is not a matrix or if the dimensions do not match for multiplication.
     */
    multiply(other) {
        if (!(other instanceof Matrix)) {
            throw new Error("L'argomento deve essere un'istanza di Matrix");
        }
        
        if (this.cols !== other.rows) {
            throw new Error("Il numero di colonne della prima matrice deve essere uguale al numero di righe della seconda");
        }

        let result = new Matrix(this.rows, other.cols);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < other.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.get(i, k) * other.get(k, j);
                }
                result.set(i, j, sum);
            }
        }

        return result;
    }

    /**
     * Transposes the matrix, flipping it over its diagonal.
     * @returns {Matrix} A new matrix that is the transpose of the original.
     */
    transpose(){
        let result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let value = this.get(i,j);
                result.set(j,i,value);   
            }
        }
        return result;
    }

    /**
     * Creates a square diagonal matrix from an array of elements.
     * @param {number[]} elems - The elements to place on the diagonal.
     * @returns {Matrix} The diagonal matrix.
     */
    static diag(elems) {
        const size = elems.length;
        const elements = new Array(size * size).fill(0);

        for (let i = 0; i < size; i++) {
            elements[i * size + i] = elems[i];
        }

        return new Matrix(size, size, elements);
    }

    /**
     * Creates an identity matrix of the specified size.
     * @param {number} n - The size of the identity matrix.
     * @returns {Matrix} The identity matrix.
     */
    static identity(n){
        const elems = [];
        for(let i = 0; i < n; i++){
            elems.push(1);
        }
        return Matrix.diag(elems);
    }
}

/**
 * TransformationMatrix
 * A specialized matrix class for handling rotation transformations in 3D space.
 */
class TransformationMatrix extends Matrix {
    /**
     * Creates a new 4x4 transformation matrix. 
     * If elements are provided, initializes the matrix with them.
     * @param {number[]} [elems=[]] - Optional flat array of 16 elements to initialize the matrix.
     */
    constructor(elems = []) {
        super(4, 4, elems.length ? elems : TransformationMatrix.identity(4).getElements());
    }

    /**
     * Computes the inverse of this rotation matrix.
     * @returns {TransformationMatrix} The inverse rotation matrix.
     * @throws Will throw an error if the matrix is not 4x4 or is non-invertible.
     */
    inverse(){
        const m = this.elements;    
        return new TransformationMatrix([
            m[0],m[1],m[2], -(m[0] * m[3] + m[4] * m[7] + m[8] * m[11]),
            m[4],m[5],m[6], -(m[1] * m[3] + m[5] * m[7] + m[9] * m[11]),
            m[8],m[9],m[10], -(m[2] * m[3] + m[6] * m[7] + m[10] * m[11]),
            0, 0, 0,1
        ]);
    }
    /**
     * Transforms a vector by this matrix, including translation components.
     * @param {Vector3D} vector - The vector to transform.
     * @returns {Vector3D} The transformed vector.
     */
    transform(vector) {
        const x = vector.x, y = vector.y, z = vector.z;
        const m = this.elements;
        const w = m[12] * x + m[13] * y + m[14] * z + m[15];
        return new Vector3D(
            m[0] * x + m[1] * y + m[2] * z + m[3],
            m[4] * x + m[5] * y + m[6] * z + m[7],
            m[8] * x + m[9] * y + m[10] * z + m[11]
        ).scale(1/w);
    }
    


    /** Gets the traslation of the transformation matrix.
     * @returns {Vector3D} the traslation of the transformation matrix.
     */
    get traslation(){
        const m = this.elements;
        return new Vector3D(m[3],m[7],m[11]);
    }

    /**
     * Puts a new traslation on the matrix.
     * @param {Vector3D} the translation to be set. 
     * @returns {TransformationMatrix} a new TransformationMatrix with the new traslation.
     */
    setTraslation(traslation) {
        const m = this.elements;
        m[3] = traslation.x;
        m[7] = traslation.y;
        m[11] = traslation.z;
        return new TransformationMatrix(m);
    }

    /**
     * Multiplies this transformation matrix with another matrix.
     * @param {Matrix} other - The matrix to multiply with.
     * @returns {TransformationMatrix} The result of the multiplication.
     */
    multiply(other){
        const result = super.multiply(other);
        if(other instanceof TransformationMatrix){
            return new TransformationMatrix(result.getElements());
        } 
        return result;
    }

    /**
     * Creates a diagonal rotation matrix.
     * @param {number[]} elems - The elements to place on the diagonal.
     * @returns {TransformationMatrix} The diagonal rotation matrix.
     */
    static diag(elems) {
        return new TransformationMatrix(super.diag(elems).getElements());
    }

    /**
     * Creates an identity matrix.
     * @returns {TransformationMatrix} The identity matrix.
     */
    static identity(){
        return new TransformationMatrix(super.identity(4).getElements());
    }

    /**
     * Creates a rotation matrix that rotates the points in the specified axis angles.
     * @param {number} x: rotation angle around x-axis.
     * @param {number} y: rotation angle around y-axis.
     * @param {number} z: rotation angle around z-axis.
     * @returns {TransformationMatrix} The resulting rotation matrix.
     */
    static createRotationMatrix(x, y, z, xAxis = new Vector3D(1, 0, 0), yAxis = new Vector3D(0, 1, 0), zAxis = new Vector3D(0, 0, 1)) {
        const rotationX = TransformationMatrix.createRotationAroundAxis(x,xAxis);
        const rotationY = TransformationMatrix.createRotationAroundAxis(y,yAxis);        
        const rotationZ = TransformationMatrix.createRotationAroundAxis(z,zAxis);
    
        const rotationMatrix = rotationZ
            .multiply(rotationY)
            .multiply(rotationX);
        
    
        return rotationMatrix;
    }

    /**
     * Creates a scaling matrix with the given scale factors.
     * @param {number} scaleX - Scale factor along the x-axis.
     * @param {number} scaleY - Scale factor along the y-axis.
     * @param {number} scaleZ - Scale factor along the z-axis.
     * @returns {TransformationMatrix} The scaling matrix.
     */
    static createScaleMatrix(scaleX, scaleY, scaleZ) {
        return new TransformationMatrix([
            scaleX, 0,      0,      0,
            0,      scaleY, 0,      0,
            0,      0,      scaleZ, 0,
            0,      0,      0,      1
        ]);
    }
    

    /**
     * Creates a traslation matrix that traslates the points in the specified direction.
     * @param {Vector3D} direction - The direction in which to traslate.
     * @returns {TransformationMatrix} The resulting traslation matrix.
     */
    static createTraslationMatrix(direction){
        return new TransformationMatrix(
            [
                1,0,0,direction.x,
                0,1,0,direction.y,
                0,0,1,direction.z,
                0,0,0,1
            ]
        );
    }

    /**
     * Creates a rotation matrix that rotates around a specific axis.
     * @param {number} angle - The angle of rotation in radians.
     * @param {Vector3D} axis - The axis of rotation.
     * @retnurs {TransformationMatrix} The resulting rotation matrix.
     */
    static createRotationAroundAxis(angle,axis){
        const cos = Math.cos(angle);
        const mcos = 1-cos;
        const sin = Math.sin(angle);
        const ux = axis.x; const uy = axis.y; const uz = axis.z;
        return new TransformationMatrix([
            cos + ux*ux*mcos, ux*uy*mcos-uz*sin, ux*uz*mcos+uy*sin, 0,
            uy*ux*mcos+uz*sin, cos + uy*uy*mcos, uy*uz*mcos-ux*sin, 0,
            uz*ux*mcos-uy*sin, uz*uy*mcos+ux*sin, cos + uz*uz*mcos, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Creates a rotation matrix that rotates around a specific point.
     * @param {number} angle - The angle of rotation in radians.
     * @param {Vector3D} axis - The axis of rotation.
     * @param {Vector3D} point - The point around which to rotate.
     * @retnurs {TransformationMatrix} The resulting rotation matrix.
     */
    static createRotationAroundPoint(angle, axis, point) {
        const u = axis.normalize();
        const x = point.x;
        const y = point.y;
        const z = point.z;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;

        const elements = [
            u.x*u.x*t + c,      u.x*u.y*t - u.z*s,  u.x*u.z*t + u.y*s,  (x*(u.x*u.x-1) + y*u.x*u.y + z*u.x*u.z)*t + (y*u.z - z*u.y)*s,
            u.y*u.x*t + u.z*s,  u.y*u.y*t + c,      u.y*u.z*t - u.x*s,  (y*(u.y*u.y-1) + x*u.x*u.y + z*u.y*u.z)*t + (z*u.x - x*u.z)*s,
            u.z*u.x*t - u.y*s,  u.z*u.y*t + u.x*s,  u.z*u.z*t + c,      (z*(u.z*u.z-1) + x*u.x*u.z + y*u.y*u.z)*t + (x*u.y - y*u.x)*s,
            0,                  0,                  0,                  1
        ];

        return new TransformationMatrix(elements);
    }

    /**
     * Creates a perspective projection matrix.
     * @param {number} fieldOfViewInRadians - The field of view in radians.
     * @param {number} aspect - The aspect ratio.
     * @param {number} near - The distance to the near clipping plane.
     * @param {number} far - The distance to the far clipping plane.
     * @returns {Matrix} The perspective projection matrix.
     */
    static createPerspective(fieldOfViewInRadians, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);

        return new TransformationMatrix([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }

    /**
     * Creates a view matrix looking from a specific point toward a target.
     * @param {Vector3D} eye - The position of the camera.
     * @param {Vector3D} center - The target point to look at.
     * @param {Vector3D} up - The up direction.
     * @returns {TransformationMatrix} The view matrix.
     */
    static createLookAt(eye, center, up) {
        const f = center.subtract(eye).normalize();
        const s = f.cross(up).normalize();
        const u = s.cross(f);

        return new TransformationMatrix([
            s.x, u.x, -f.x, 0,
            s.y, u.y, -f.y, 0,
            s.z, u.z, -f.z, 0,
            -s.dot(eye), -u.dot(eye), f.dot(eye), 1
        ]);
    }
}
