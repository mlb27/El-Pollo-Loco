class ChickenSmall extends MovableObject {
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a small chicken at the given world position.
     * @param {number} x - Horizontal world position.
     */
    constructor(x) {
        super();
        this.setChickenProperties(x);
        this.loadChickenImages();
        this.animate();
    }

    /**
     * Sets size, speed and position of the small chicken.
     * @param {number} x - Horizontal world position.
     */
    setChickenProperties(x) {
        this.height = 50;
        this.width = 50;
        this.y = 385;
        this.x = x;
        this.speed = 0.35 + Math.random() * 0.3;
    }

    /** Loads walking and death images into the image cache. */
    loadChickenImages() {
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /** Starts movement and walking animation loops. */
    animate() {
        this.movementInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
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
