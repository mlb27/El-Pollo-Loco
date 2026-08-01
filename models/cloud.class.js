class Cloud extends MovableObject {
    constructor(x = Math.random() * 500) {
        super().loadImage("img/5_background/layers/4_clouds/1.png");

        this.x = x;
        this.y = 5 + Math.random() * 100;
        this.width = 300;
        this.height = 300;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

}