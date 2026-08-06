class EndbossAnimation {
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemy_boss_chicken/2_alert/G5.png',
        'img/4_enemy_boss_chicken/2_alert/G6.png',
        'img/4_enemy_boss_chicken/2_alert/G7.png',
        'img/4_enemy_boss_chicken/2_alert/G8.png',
        'img/4_enemy_boss_chicken/2_alert/G9.png',
        'img/4_enemy_boss_chicken/2_alert/G10.png',
        'img/4_enemy_boss_chicken/2_alert/G11.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemy_boss_chicken/3_attack/G13.png',
        'img/4_enemy_boss_chicken/3_attack/G14.png',
        'img/4_enemy_boss_chicken/3_attack/G15.png',
        'img/4_enemy_boss_chicken/3_attack/G16.png',
        'img/4_enemy_boss_chicken/3_attack/G17.png',
        'img/4_enemy_boss_chicken/3_attack/G18.png'
    ];

    IMAGES_LANDING = [
        'img/4_enemy_boss_chicken/3_attack/G19.png',
        'img/4_enemy_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];

    constructor(endboss) {
        this.endboss = endboss;
        this.loadImages();
    }

    loadImages() {
        this.getImageGroups().forEach((images) => this.endboss.loadImages(images));
    }

    getImageGroups() {
        return [this.IMAGES_WALKING, this.IMAGES_ALERT, this.IMAGES_ATTACK,
            this.IMAGES_LANDING, this.IMAGES_HURT, this.IMAGES_DEAD];
    }

    start(images, options) {
        this.stopFrameAnimation();
        this.animationImages = images;
        this.frameDuration = options.duration;
        this.animationCallback = options.onComplete;
        this.currentImage = options.startIndex || 0;
        this.showFrame(options.firstDelay ?? options.duration);
    }

    showFrame(frameDelay) {
        this.displayedFrameIndex = this.currentImage;
        const path = this.animationImages[this.currentImage];
        this.endboss.img = this.endboss.imageCache[path];
        this.frameDeadline = Date.now() + frameDelay;
        this.frameTimer = setTimeout(() => this.advanceFrame(), frameDelay);
    }

    advanceFrame() {
        const lastImageIndex = this.animationImages.length - 1;
        if (this.displayedFrameIndex < lastImageIndex) {
            this.currentImage = this.displayedFrameIndex + 1;
            this.showFrame(this.frameDuration);
        } else this.runCallback();
    }

    runCallback() {
        const callback = this.animationCallback;
        this.animationCallback = null;
        if (callback) callback();
    }

    getSnapshot() {
        return {
            frameIndex: this.displayedFrameIndex,
            frameTime: Math.max(0, this.frameDeadline - Date.now())
        };
    }

    showLastFrame(images) {
        const lastImage = images[images.length - 1];
        this.endboss.img = this.endboss.imageCache[lastImage];
    }

    startWalkAnimation() {
        audioManager.playLoopingSound('endbossWalking');
        if (this.walkInterval) return;
        this.walkInterval = setInterval(() => {
            this.endboss.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

    pauseWalkAnimation() {
        clearInterval(this.walkInterval);
        this.walkInterval = null;
        audioManager.stopLoopingSound('endbossWalking');
    }

    stopFrameAnimation() {
        clearTimeout(this.frameTimer);
        this.animationCallback = null;
    }
}