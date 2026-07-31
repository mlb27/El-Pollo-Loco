class Character extends MovableObject {

    height = 250;
    y = 80;
    speed = 5;

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ]

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ]

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;
    stompProtectionActive = false;
    stompProtectionTimeout;
    deathAnimationStarted = false;
    collectedBottles = 0;
    maxBottles = 5;

    constructor() {
        super().loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE)
        this.applyGravity();
        this.animate();
    }

    hit() {
        if (this.isDead()) return;
        super.hit();
        this.playCurrentHitSound();
        if (this.isDead()) this.handleDeath();
        else audioManager.playSound('stompSplash');
    }

    playCurrentHitSound() {
        const hitNumber = (100 - this.energy) / 20;
        if (hitNumber <= 4) audioManager.playSound(`characterHit${hitNumber}`);
    }

    canCollectBottle() {
        return this.collectedBottles < this.maxBottles;
    }

    collectBottle() {
        if (this.canCollectBottle()) this.collectedBottles++;
    }

    hasBottle() {
        return this.collectedBottles > 0;
    }

    useBottle() {
        if (this.hasBottle()) this.collectedBottles--;
    }

    getBottlePercentage() {
        return this.collectedBottles / this.maxBottles * 100;
    }

    handleDeath() {
        audioManager.playSound('characterDied');
        this.startDeathAnimation();
        this.world.startGameOver();
    }

    startDeathAnimation() {
        if (this.deathAnimationStarted) return;
        this.deathAnimationStarted = true;
        this.currentImage = 0;
        this.playDeathFrame();
        this.deathAnimationInterval = setInterval(() => this.playDeathFrame(), 160);
    }

    playDeathFrame() {
        const lastImageIndex = this.IMAGES_DEAD.length - 1;
        const path = this.IMAGES_DEAD[this.currentImage];
        this.img = this.imageCache[path];
        if (this.currentImage < lastImageIndex) {
            this.currentImage++;
        } else {
            clearInterval(this.deathAnimationInterval);
        }
    }

    bounceAfterStomp() {
        clearTimeout(this.stompProtectionTimeout);
        this.stompProtectionActive = true;
        this.jump();
        this.stompProtectionTimeout = setTimeout(() => {
            this.stompProtectionActive = false;
        }, 500);
    }

    animate() {
        this.movementInterval = setInterval(() => this.moveCharacter(), 1000 / 60);
        this.animationInterval = setInterval(() => this.playCharacterAnimation(), 100);
    }

    moveCharacter() {
        if (this.isFrozen) return;
        this.moveHorizontally();
        this.jumpIfPossible();
        this.world.camera_x = -this.x + 100;
    }

    moveHorizontally() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    jumpIfPossible() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            audioManager.playSound('characterJump');
        }
    }

    playCharacterAnimation() {
        if (this.isDead() || this.isFrozen) return;
        if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else this.playAnimation(this.IMAGES_IDLE);
    }
}
