class BackgroundObject extends MovableObject {
    /**
     * Creates a background object at the given horizontal position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal world position.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath)
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480
    }
}