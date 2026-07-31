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
    isOnGround = false;
    isExpired = false;

    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.setBottleProperties(x, y, otherDirection);
        this.loadBottleImages();
        this.throw();
        this.animate();
    }

    setBottleProperties(x, y, otherDirection) {
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.speedX = otherDirection ? -15 : 15;
    }

    loadBottleImages() {
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImages(this.IMAGES_GROUND);
    }

    throw() {
        this.speedY = 5;
        this.applyGravity();
        audioManager.playSound('bottleThrow');
        this.movementInterval = setInterval(() => {
            this.moveBottle();
        }, 25);
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.hasHitEnemy && !this.isOnGround) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    moveBottle() {
        this.x += this.speedX;
        this.checkGroundCollision();
    }

    checkGroundCollision() {
        if (!this.hasHitEnemy && this.y >= this.groundY) {
            this.y = this.groundY;
            if (this.hasHitGround) this.landOnGround();
            else this.bounceFromGround();
        }
    }

    bounceFromGround() {
        this.hasHitGround = true;
        this.speedY = 3;
        this.speedX = this.otherDirection ? -5 : 5;
        audioManager.playSound('bottleLand');
    }

    landOnGround() {
        this.stopBottle();
        this.isOnGround = true;
        this.showGroundImage();
        this.expireAfter(1000);
    }

    showGroundImage() {
        clearInterval(this.animationInterval);
        const imageIndex = this.otherDirection ? 1 : 0;
        this.img = this.imageCache[this.IMAGES_GROUND[imageIndex]];
        this.otherDirection = false;
    }

    expireAfter(milliseconds) {
        setTimeout(() => {
            this.isExpired = true;
        }, milliseconds);
    }

    canHitEnemy() {
        return !this.hasHitGround && !this.hasHitEnemy;
    }

    hitEnemy() {
        this.hasHitEnemy = true;
        this.speedY = 0;
        this.stopBottle();
        audioManager.playSound('bottleHit');
        this.enlargeSplash();
        this.startSplashAnimation();
    }

    enlargeSplash() {
        this.x -= 15;
        this.y -= 10;
        this.width = 80;
        this.height = 80;
    }

    startSplashAnimation() {
        clearInterval(this.animationInterval);
        this.currentImage = 0;
        this.playSplashFrame();
        this.animationInterval = setInterval(() => {
            this.playSplashFrame();
        }, 100);
    }

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

    stopBottle() {
        this.speedX = 0;
        clearInterval(this.movementInterval);
    }

    freeze() {
        super.freeze();
        this.stopBottle();
        clearInterval(this.animationInterval);
    }
}
