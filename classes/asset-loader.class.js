class AssetLoader {
    IMAGE_PATHS = [
        'img/game/10_win_loss/You lost.png',
        'img/game/10_win_loss/You won A.png',
        'img/game/2_character_pepe/1_idle/idle/I-1.png',
        'img/game/2_character_pepe/1_idle/idle/I-10.png',
        'img/game/2_character_pepe/1_idle/idle/I-2.png',
        'img/game/2_character_pepe/1_idle/idle/I-3.png',
        'img/game/2_character_pepe/1_idle/idle/I-4.png',
        'img/game/2_character_pepe/1_idle/idle/I-5.png',
        'img/game/2_character_pepe/1_idle/idle/I-6.png',
        'img/game/2_character_pepe/1_idle/idle/I-7.png',
        'img/game/2_character_pepe/1_idle/idle/I-8.png',
        'img/game/2_character_pepe/1_idle/idle/I-9.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/game/2_character_pepe/1_idle/long_idle/I-20.png',
        'img/game/2_character_pepe/2_walk/W-21.png',
        'img/game/2_character_pepe/2_walk/W-22.png',
        'img/game/2_character_pepe/2_walk/W-23.png',
        'img/game/2_character_pepe/2_walk/W-24.png',
        'img/game/2_character_pepe/2_walk/W-25.png',
        'img/game/2_character_pepe/2_walk/W-26.png',
        'img/game/2_character_pepe/3_jump/J-31.png',
        'img/game/2_character_pepe/3_jump/J-32.png',
        'img/game/2_character_pepe/3_jump/J-33.png',
        'img/game/2_character_pepe/3_jump/J-34.png',
        'img/game/2_character_pepe/3_jump/J-35.png',
        'img/game/2_character_pepe/3_jump/J-36.png',
        'img/game/2_character_pepe/3_jump/J-37.png',
        'img/game/2_character_pepe/3_jump/J-38.png',
        'img/game/2_character_pepe/3_jump/J-39.png',
        'img/game/2_character_pepe/4_hurt/H-41.png',
        'img/game/2_character_pepe/4_hurt/H-42.png',
        'img/game/2_character_pepe/4_hurt/H-43.png',
        'img/game/2_character_pepe/5_dead/D-51.png',
        'img/game/2_character_pepe/5_dead/D-52.png',
        'img/game/2_character_pepe/5_dead/D-53.png',
        'img/game/2_character_pepe/5_dead/D-54.png',
        'img/game/2_character_pepe/5_dead/D-55.png',
        'img/game/2_character_pepe/5_dead/D-56.png',
        'img/game/2_character_pepe/5_dead/D-57.png',
        'img/game/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/game/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/game/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
        'img/game/3_enemies_chicken/chicken_normal/2_dead/dead.png',
        'img/game/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/game/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/game/3_enemies_chicken/chicken_small/1_walk/3_w.png',
        'img/game/3_enemies_chicken/chicken_small/2_dead/dead.png',
        'img/game/4_enemy_boss_chicken/1_walk/G1.png',
        'img/game/4_enemy_boss_chicken/1_walk/G2.png',
        'img/game/4_enemy_boss_chicken/1_walk/G3.png',
        'img/game/4_enemy_boss_chicken/1_walk/G4.png',
        'img/game/4_enemy_boss_chicken/2_alert/G10.png',
        'img/game/4_enemy_boss_chicken/2_alert/G11.png',
        'img/game/4_enemy_boss_chicken/2_alert/G5.png',
        'img/game/4_enemy_boss_chicken/2_alert/G6.png',
        'img/game/4_enemy_boss_chicken/2_alert/G7.png',
        'img/game/4_enemy_boss_chicken/2_alert/G8.png',
        'img/game/4_enemy_boss_chicken/2_alert/G9.png',
        'img/game/4_enemy_boss_chicken/3_attack/G13.png',
        'img/game/4_enemy_boss_chicken/3_attack/G14.png',
        'img/game/4_enemy_boss_chicken/3_attack/G15.png',
        'img/game/4_enemy_boss_chicken/3_attack/G16.png',
        'img/game/4_enemy_boss_chicken/3_attack/G17.png',
        'img/game/4_enemy_boss_chicken/3_attack/G18.png',
        'img/game/4_enemy_boss_chicken/3_attack/G19.png',
        'img/game/4_enemy_boss_chicken/3_attack/G20.png',
        'img/game/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/game/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/game/4_enemy_boss_chicken/4_hurt/G23.png',
        'img/game/4_enemy_boss_chicken/5_dead/G24.png',
        'img/game/4_enemy_boss_chicken/5_dead/G25.png',
        'img/game/4_enemy_boss_chicken/5_dead/G26.png',
        'img/game/5_background/layers/1_first_layer/1.png',
        'img/game/5_background/layers/1_first_layer/2.png',
        'img/game/5_background/layers/2_second_layer/1.png',
        'img/game/5_background/layers/2_second_layer/2.png',
        'img/game/5_background/layers/3_third_layer/1.png',
        'img/game/5_background/layers/3_third_layer/2.png',
        'img/game/5_background/layers/4_clouds/1.png',
        'img/game/5_background/layers/air.png',
        'img/game/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/game/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/game/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/game/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/game/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/game/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/game/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/game/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue100.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/game/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/game/8_coin/coin_1.png',
        'img/game/9_intro_outro_screens/start/startscreen_1.png',
        'img/backgrounds/desert.jpg',
        'img/favicon.png',
        'img/ui/frame.png',
        'img/ui/game-icons.png',
        'img/ui/menu-icons.png',
        'img/ui/menu-tab.png',
        'img/ui/rotate-phone.png',
    ];
    imageCache = {};

    /**
     * Waits until the selected images have loaded and decoded.
     * @param {string[]} [paths=this.IMAGE_PATHS] - Image paths to preload.
     */
    async preloadImages(paths = this.IMAGE_PATHS) {
        await Promise.all(paths.map((path) => this.preloadImage(path)));
    }

    /**
     * Loads and decodes one image asset.
     * @param {string} path - Image asset path.
     * @returns {Promise<void>} Completed image-loading task.
     */
    preloadImage(path) {
        const image = new Image();
        this.imageCache[path] = image;
        return new Promise((resolve) => {
            image.onload = () => this.decodeImage(image).finally(resolve);
            image.onerror = resolve;
            image.src = path;
        });
    }

    /**
     * Decodes a loaded image when supported by the browser.
     * @param {HTMLImageElement} image - Loaded browser image.
     * @returns {Promise<void>} Completed decoding task.
     */
    decodeImage(image) {
        if (!image.decode) return Promise.resolve();
        return image.decode().catch(() => {});
    }

    /**
     * Returns a cached image and provides a fallback for new assets.
     * @param {string} path - Requested image path.
     * @returns {HTMLImageElement} Cached browser image.
     */
    getImage(path) {
        if (!this.imageCache[path]) {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        }
        return this.imageCache[path];
    }
}

const assetLoader = new AssetLoader();
