class Cloud extends MovableObject {
    /**
     * Creates a moving cloud.
     * @param {number} [x] - Optional horizontal starting position.
     */
    constructor(x = Math.random() * 500) {
        super().loadImage("img/game/5_background/layers/4_clouds/1.png");

        this.x = x;
        this.y = 5 + Math.random() * 100;
        this.width = 300;
        this.height = 300;
        this.animate();
    }

    /** Starts the continuous cloud movement. */
    animate() {
        this.moveLeft();
    }

}