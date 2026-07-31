class Endboss extends MovableObject {

    IMAGES_WALKING = [
        "img/4_enemy_boss_chicken/2_alert/G5.png",
        "img/4_enemy_boss_chicken/2_alert/G6.png",
        "img/4_enemy_boss_chicken/2_alert/G7.png",
        "img/4_enemy_boss_chicken/2_alert/G8.png",
        "img/4_enemy_boss_chicken/2_alert/G9.png",
        "img/4_enemy_boss_chicken/2_alert/G10.png",
        "img/4_enemy_boss_chicken/2_alert/G11.png",
        "img/4_enemy_boss_chicken/2_alert/G12.png",

    ]

    spawnSoundPlayed = false;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2200;
        this.y = 55;
        this.width = 250;
        this.height = 400;
        this.animate();

    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 200);
    }

    playSpawnSound() {
        if (!this.spawnSoundPlayed) {
            this.spawnSoundPlayed = true;
            audioManager.playSound('endbossSpawn');
        }
    }

}
