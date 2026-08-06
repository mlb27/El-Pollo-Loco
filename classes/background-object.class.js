class BackgroundObject extends MovableObject {
    constructor(imagePath, x) {
        super().loadImage(imagePath)
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480
    }
}