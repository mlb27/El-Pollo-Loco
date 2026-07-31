class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 0.5;
    otherDirection = false;
    isFrozen = false;

    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (!this.isFrozen && (this.isAboveGround() || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return !this.hasHitEnemy && this.y < this.groundY;
        }
        return this.y < 180;
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    isJumpingOn(mo) {
        return this.isColliding(mo) &&
            this.speedY < 0 &&
            this.y + this.height <= mo.y + mo.height / 2;
    }

    hit() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }

    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        if (!this.isFrozen) this.x += this.speed;
    }

    moveLeft() {
        if (!this.isFrozen) this.x -= this.speed;
    };

    playAnimation(images) {
        if (this.isFrozen) return;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        if (!this.isFrozen) this.speedY = 11;
    }

    freeze() {
        this.isFrozen = true;
        this.speedY = 0;
    }
}
