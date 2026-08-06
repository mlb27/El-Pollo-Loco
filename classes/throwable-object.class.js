class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    IMAGES_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    speedX = 15;
    groundY = 370;
    hasHitGround = false;
    hasHitEnemy = false;
    hasBeenBlocked = false;
    isOnGround = false;
    isExpired = false;

    /**
     * Creates and throws a salsa bottle.
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     * @param {boolean} [otherDirection=false] - Whether the bottle flies left.
     */
    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.setBottleProperties(x, y, otherDirection);
        this.loadBottleImages();
        this.throw();
        this.animate();
    }

    /**
     * Sets the bottle position, size and flight direction.
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     * @param {boolean} otherDirection - Whether the bottle flies left.
     */
    setBottleProperties(x, y, otherDirection) {
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.speedX = otherDirection ? -15 : 15;
    }

    /** Loads rotation, splash and ground images. */
    loadBottleImages() {
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImages(this.IMAGES_GROUND);
    }

    /** Starts bottle physics, movement and throw sound. */
    throw() {
        this.speedY = 5;
        this.applyGravity();
        audioManager.playSound('bottleThrow');
        this.movementInterval = setInterval(() => {
            this.moveBottle();
        }, 25);
    }

    /** Starts the bottle rotation animation. */
    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.hasHitEnemy && !this.isOnGround) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    /** Moves the bottle horizontally and checks the ground. */
    moveBottle() {
        this.x += this.speedX;
        this.checkGroundCollision();
    }

    /** Handles the bottle collision with the ground. */
    checkGroundCollision() {
        if (!this.hasHitEnemy && this.y >= this.groundY) {
            this.y = this.groundY;
            if (this.hasHitGround) this.landOnGround();
            else this.bounceFromGround();
        }
    }

    /** Applies the first ground bounce and landing sound. */
    bounceFromGround() {
        this.hasHitGround = true;
        this.speedY = 3;
        this.speedX = this.otherDirection ? -5 : 5;
        audioManager.playSound('bottleLand');
    }

    /** Stops the bottle and schedules its removal. */
    landOnGround() {
        this.stopBottle();
        this.isOnGround = true;
        this.showGroundImage();
        this.expireAfter(1000);
    }

    /** Displays the ground image matching the throw direction. */
    showGroundImage() {
        clearInterval(this.animationInterval);
        const imageIndex = this.otherDirection ? 1 : 0;
        this.img = this.imageCache[this.IMAGES_GROUND[imageIndex]];
        this.otherDirection = false;
    }

    /**
     * Marks the bottle as expired after a delay.
     * @param {number} milliseconds - Delay before removal.
     */
    expireAfter(milliseconds) {
        setTimeout(() => {
            this.isExpired = true;
        }, milliseconds);
    }

    /**
     * Checks whether the bottle may damage an enemy.
     * @returns {boolean} Whether the bottle can hit an enemy.
     */
    canHitEnemy() {
        return !this.hasHitGround && !this.hasHitEnemy && !this.hasBeenBlocked;
    }

    /** Reverses the bottle after an endboss block. */
    bounceOffEndboss() {
        this.hasBeenBlocked = true;
        this.otherDirection = !this.otherDirection;
        this.speedX = this.otherDirection ? -8 : 8;
        this.speedY = 5;
        audioManager.playSound('endbossThrowableBlocked');
    }

    /** Stops the bottle and starts its splash after a hit. */
    hitEnemy() {
        this.hasHitEnemy = true;
        this.speedY = 0;
        this.stopBottle();
        audioManager.playSound('bottleHit');
        this.enlargeSplash();
        this.startSplashAnimation();
    }

    /** Enlarges and repositions the bottle splash. */
    enlargeSplash() {
        this.x -= 15;
        this.y -= 10;
        this.width = 80;
        this.height = 80;
    }

    /** Starts the splash frame animation. */
    startSplashAnimation() {
        clearInterval(this.animationInterval);
        this.currentImage = 0;
        this.playSplashFrame();
        this.animationInterval = setInterval(() => {
            this.playSplashFrame();
        }, 100);
    }

    /** Displays the next splash frame or expires the bottle. */
    playSplashFrame() {
        if (this.currentImage < this.IMAGES_SPLASH.length) {
            const path = this.IMAGES_SPLASH[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            clearInterval(this.animationInterval);
            this.isExpired = true;
        }
    }

    /** Stops horizontal bottle movement. */
    stopBottle() {
        this.speedX = 0;
        clearInterval(this.movementInterval);
    }

    /** Freezes all bottle movement and animations. */
    freeze() {
        super.freeze();
        this.stopBottle();
        clearInterval(this.animationInterval);
    }
}
