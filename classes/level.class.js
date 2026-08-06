class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 3500;

    /**
     * Creates a level with all world objects and collectibles.
     * @param {MovableObject[]} enemies - Enemies contained in the level.
     * @param {Cloud[]} clouds - Clouds contained in the level.
     * @param {BackgroundObject[]} backgroundObjects - Layered background objects.
     * @param {Bottle[]} [bottles=[]] - Collectible bottles.
     * @param {Coin[]} [coins=[]] - Collectible coins.
     */
    constructor(enemies, clouds, backgroundObjects, bottles = [], coins = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}
