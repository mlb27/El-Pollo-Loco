class Chicken extends MovableObject {
    IMAGES_WALKING = [
        "img/game/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/game/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/game/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        "img/game/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];
    /**
     * Creates a normal chicken at the given world position.
     * @param {number} x - Horizontal world position.
     */
    constructor(x) {
        super();

        this.height = 80;
        this.width = 70;
        this.y = 355;
        this.loadImage("img/game/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = x;
        this.speed = 0.30 + Math.random() * 0.25;
        this.animate();
    }

    /** Starts movement and walking animation loops. */
    animate() {
        this.movementInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 150);
    }

    /** Stops the chicken and displays its death image. */
    die() {
        this.energy = 0;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        audioManager.playSound('chickenHit');
    }
}
