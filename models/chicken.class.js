class Chicken extends MovableObject {
    constructor(x) {
        super();

        this.height = 80;
        this.width = 70;
        this.y = 355;
        this.IMAGES_WALKING = [
            "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
            "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
            "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
        ];
        this.IMAGES_DEAD = [
            "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
        ];
        this.hitSound = new Audio('audio/chicken-hit.mp3');
        this.stompSplashSound = new Audio('audio/stomp-splash.mp3');
        this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = x;
        this.speed = 0.30 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.movementInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 150);
    }

    die() {
        this.energy = 0;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        this.hitSound.currentTime = 0;
        this.hitSound.play();
    }

    playStompSound() {
        this.stompSplashSound.currentTime = 0;
        this.stompSplashSound.play();
    }
}
