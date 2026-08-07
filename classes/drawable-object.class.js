class DrawableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;

    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image as the currently displayed image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = assetLoader.getImage(path);
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Paths to the image files.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            this.imageCache[path] = assetLoader.getImage(path);
        });
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    /**
     * Draws a debug collision frame for supported objects.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    showDebugFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

        }
    }
}
