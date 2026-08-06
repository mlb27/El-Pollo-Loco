class WorldItemHandler {
    /**
     * Creates an item and projectile handler for a game world.
     * @param {World} world - Game world whose items are handled.
     */
    constructor(world) {
        this.world = world;
    }

    /** Checks every thrown bottle against every enemy. */
    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyCollision(bottle, enemy);
            });
        });
    }

    /**
     * Handles a bottle hit or an endboss block.
     * @param {ThrowableObject} bottle - Thrown bottle.
     * @param {MovableObject} enemy - Colliding enemy.
     */
    handleBottleEnemyCollision(bottle, enemy) {
        if (this.canBottleHitEnemy(bottle, enemy)) this.hitEnemyWithBottle(bottle, enemy);
        else if (this.canEndbossBlockBottle(bottle, enemy)) bottle.bounceOffEndboss();
    }

    /**
     * Checks whether the protected endboss blocks a bottle.
     * @param {ThrowableObject} bottle - Thrown bottle.
     * @param {MovableObject} enemy - Potential endboss target.
     * @returns {boolean} Whether the bottle is blocked.
     */
    canEndbossBlockBottle(bottle, enemy) {
        return enemy instanceof Endboss && !enemy.isDead() && !enemy.canBeHit() &&
            bottle.canHitEnemy() && bottle.isColliding(enemy);
    }

    /**
     * Checks whether a bottle can damage an enemy.
     * @param {ThrowableObject} bottle - Thrown bottle.
     * @param {MovableObject} enemy - Potential target.
     * @returns {boolean} Whether a damaging hit is valid.
     */
    canBottleHitEnemy(bottle, enemy) {
        const canBeHit = this.world.isChicken(enemy) ||
            enemy instanceof Endboss && enemy.canBeHit();
        return canBeHit &&
            !enemy.isDead() && bottle.canHitEnemy() && bottle.isColliding(enemy);
    }

    /**
     * Applies a valid bottle hit to an enemy.
     * @param {ThrowableObject} bottle - Hitting bottle.
     * @param {MovableObject} enemy - Enemy receiving the hit.
     */
    hitEnemyWithBottle(bottle, enemy) {
        bottle.hitEnemy();
        if (this.world.isChicken(enemy)) this.world.killChicken(enemy);
        else this.hitEndboss(enemy);
    }

    /**
     * Damages the endboss and updates its status bar.
     * @param {Endboss} endboss - Endboss receiving damage.
     */
    hitEndboss(endboss) {
        endboss.hit();
        this.world.endbossBar.setPercentage(endboss.getEnergyPercentage());
        if (endboss.isDead()) this.world.startGameWon();
    }

    /** Removes expired thrown bottles from the world. */
    removeExpiredBottles() {
        this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => !bottle.isExpired);
    }

    /** Checks all collectible bottles against the character. */
    checkBottlePickups() {
        this.world.level.bottles.forEach((bottle) => {
            if (this.canCollectBottle(bottle)) this.collectBottle(bottle);
        });
    }

    /**
     * Checks whether the character can collect a bottle.
     * @param {Bottle} bottle - Bottle to check.
     * @returns {boolean} Whether the bottle can be collected.
     */
    canCollectBottle(bottle) {
        return this.world.character.canCollectBottle() && this.world.character.isColliding(bottle);
    }

    /**
     * Collects and removes a bottle, then updates the bar.
     * @param {Bottle} bottle - Bottle to collect.
     */
    collectBottle(bottle) {
        this.world.character.collectBottle();
        audioManager.playSound('bottlePickup');
        this.world.level.bottles = this.world.level.bottles.filter((item) => item !== bottle);
        this.updateBottleBar();
    }

    /** Updates the bottle bar from the character inventory. */
    updateBottleBar() {
        this.world.bottleBar.setPercentage(this.world.character.getBottlePercentage());
    }

    /** Checks all collectible coins against the character. */
    checkCoinPickups() {
        this.world.level.coins.forEach((coin) => {
            if (this.canCollectCoin(coin)) this.collectCoin(coin);
        });
    }

    /**
     * Checks whether the character can collect a coin.
     * @param {Coin} coin - Coin to check.
     * @returns {boolean} Whether the coin can be collected.
     */
    canCollectCoin(coin) {
        return this.world.character.canCollectCoin() && this.world.character.isColliding(coin);
    }

    /**
     * Collects and removes a coin, then updates the bar.
     * @param {Coin} coin - Coin to collect.
     */
    collectCoin(coin) {
        this.world.character.collectCoin();
        audioManager.playSound('coinPickup');
        this.world.level.coins = this.world.level.coins.filter((item) => item !== coin);
        this.world.coinBar.setPercentage(this.world.character.getCoinPercentage());
    }
}