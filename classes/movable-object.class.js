class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 0.5;
    otherDirection = false;
    isFrozen = false;
    world;

    energy = 100;
    lastHit = 0;

    /** Applies gravity to the movable object. */
    applyGravity() {
        setInterval(() => {
            if (!this.isFrozen && !this.isPaused() && (this.isAboveGround() || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Checks whether the object is above its ground level.
     * @returns {boolean} Whether the object is above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return !this.hasHitEnemy && this.y < this.groundY;
        }
        return this.y < 180;
    }

    /**
     * Checks whether this object collides with another object.
     * @param {DrawableObject} mo - Object to test for collision.
     * @returns {boolean} Whether both objects overlap.
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    /**
     * Checks whether this object lands on another object from above.
     * @param {DrawableObject} mo - Object below this object.
     * @returns {boolean} Whether a valid stomp collision occurs.
     */
    isJumpingOn(mo) {
        return this.isColliding(mo) &&
            this.speedY < 0 &&
            this.y + this.height <= mo.y + mo.height / 2;
    }

    /** Reduces the object energy after a hit. */
    hit() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }

    }

    /**
     * Checks whether the recent-hit protection is active.
     * @returns {boolean} Whether the object is currently hurt.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean} Whether the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /** Moves the object to the right. */
    moveRight() {
        if (!this.isFrozen && !this.isPaused()) this.x += this.speed;
    }

    /** Moves the object to the left. */
    moveLeft() {
        if (!this.isFrozen && !this.isPaused()) this.x -= this.speed;
    };

    /**
     * Displays the next frame of an image sequence.
     * @param {string[]} images - Animation image paths.
     */
    playAnimation(images) {
        if (this.isFrozen || this.isPaused()) return;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Starts an upward jump movement. */
    jump() {
        if (!this.isFrozen && !this.isPaused()) this.speedY = 11;
    }

    /**
     * Checks whether the owning game world is paused.
     * @returns {boolean} Whether gameplay is paused.
     */
    isPaused() {
        return Boolean(this.world?.paused);
    }

    /** Freezes movement and vertical speed. */
    freeze() {
        this.isFrozen = true;
        this.speedY = 0;
    }
}
