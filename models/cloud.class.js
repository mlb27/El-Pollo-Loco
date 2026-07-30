class Cloud extends MovableObject {
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/1.png");

        this.x = 0 + Math.random() * 500;
        this.y = 5 + Math.random() * 100;
        this.width = 300;
        this.height = 300;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

}