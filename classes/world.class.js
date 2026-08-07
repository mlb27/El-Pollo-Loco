class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new EndbossBar();
    endbossBarVisible = false;
    throwableObjects = [];
    lastBottleThrow = 0;
    bottleThrowCooldown = 1000;
    gameOver = false;
    gameOverScreenVisible = false;
    gameOverImage = new Image();
    gameWon = false;
    gameWonScreenVisible = false;
    gameWonImage = new Image();
    stopped = false;
    paused = false;
    animationFrame;
    gameOverTimeout;

    /**
     * Creates the game world and starts rendering and collision checks.
     * @param {HTMLCanvasElement} canvas - Game canvas element.
     * @param {Keyboard} keyboard - Current keyboard state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.itemHandler = new WorldItemHandler(this);
        this.pauseManager = new GamePauseManager(this);
        this.loadGameOverImage();
        this.loadGameWonImage();
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    /** Connects the character and endboss with this world. */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => enemy.world = this);
    }

    /** Loads the game-over screen image. */
    loadGameOverImage() {
        this.gameOverImage = assetLoader.getImage('img/game/10_win_loss/You lost.png');
    }

    /** Loads the game-won screen image. */
    loadGameWonImage() {
        this.gameWonImage = assetLoader.getImage('img/game/10_win_loss/You won A.png');
    }

    /** Starts collision checks and bottle throwing intervals. */
    checkCollisions() {
        this.collisionInterval = setInterval(() => this.runCollisionChecks(), 1000 / 60);
        this.bottleThrowInterval = setInterval(() => this.checkThrowObjects(), 100);
    }

    /** Runs all collision and pickup checks for one game tick. */
    runCollisionChecks() {
        if (this.paused) return;
        this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
        this.itemHandler.checkBottlePickups();
        this.itemHandler.checkCoinPickups();
        this.itemHandler.checkBottleCollisions();
        this.itemHandler.removeExpiredBottles();
        this.checkEndbossVisibility();
    }

    /** Freezes the game and schedules the game-over screen. */
    startGameOver() {
        if (this.gameOver || this.gameWon) return;
        this.gameOver = true;
        audioManager.pauseBackgroundMusic();
        this.freezeGame();
        this.gameOverTimeout = setTimeout(() => {
            this.runWhenActive(() => this.showGameOverScreen());
        }, 1000);
    }

    /** Stops game intervals and freezes all moving objects. */
    freezeGame() {
        clearInterval(this.collisionInterval);
        clearInterval(this.bottleThrowInterval);
        this.character.freeze();
        this.level.enemies.forEach((enemy) => enemy.freeze());
        this.throwableObjects.forEach((bottle) => bottle.freeze());
    }

    /** Displays the game-over screen and its controls. */
    showGameOverScreen() {
        this.gameOverScreenVisible = true;
        audioManager.playSound('gameOver');
        showEndScreenControls(false);
    }

    /** Freezes the game after the endboss is defeated. */
    startGameWon() {
        if (this.gameWon || this.gameOver) return;
        this.gameWon = true;
        audioManager.pauseBackgroundMusic();
        this.freezeGame();
    }

    /** Displays the game-won screen and its controls. */
    showGameWonScreen() {
        if (!this.gameWon || this.gameWonScreenVisible) return;
        this.gameWonScreenVisible = true;
        audioManager.playSound('gameWon');
        showEndScreenControls(true);
    }

    /** Starts the endboss alert when it enters the viewport. */
    checkEndbossVisibility() {
        const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss && this.isVisible(endboss)) {
            endboss.startAlert();
            this.endbossBarVisible = endboss.alertStarted;
        }
    }

    /**
     * Checks whether an object is visible inside the canvas.
     * @param {DrawableObject} movableObject - Object to test.
     * @returns {boolean} Whether the object is visible.
     */
    isVisible(movableObject) {
        const screenX = movableObject.x + this.camera_x;
        return screenX < this.canvas.width && screenX + movableObject.width > 0;
    }

    /**
     * Checks whether an enemy is a normal or small chicken.
     * @param {MovableObject} enemy - Enemy to classify.
     * @returns {boolean} Whether the enemy is a chicken.
     */
    isChicken(enemy) {
        return enemy instanceof Chicken || enemy instanceof ChickenSmall;
    }

    /**
     * Handles stomp or damage collisions with one enemy.
     * @param {MovableObject} enemy - Enemy to check.
     */
    checkEnemyCollision(enemy) {
        if (this.isChicken(enemy) && !enemy.isDead() && this.character.isJumpingOn(enemy)) {
            this.stompChicken(enemy);
        } else if (!enemy.isDead() && this.character.isColliding(enemy) &&
            !this.character.isHurt() && !this.character.stompProtectionActive) {
            this.damageCharacter(enemy);
        }
    }

    /**
     * Damages and optionally knocks back the character.
     * @param {MovableObject} enemy - Enemy causing damage.
     */
    damageCharacter(enemy) {
        this.character.hit();
        const causesKnockback = this.isChicken(enemy) || enemy instanceof Endboss;
        if (causesKnockback && !this.character.isDead()) {
            this.character.knockBackFrom(enemy);
            if (enemy instanceof Endboss) enemy.knockBackAfterHit();
        }
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Defeats a stomped chicken and bounces the character.
     * @param {Chicken|ChickenSmall} chicken - Stomped chicken.
     */
    stompChicken(chicken) {
        this.killChicken(chicken);
        audioManager.playSound('stompSplash');
        this.character.bounceAfterStomp();
    }

    /**
     * Starts chicken death and schedules its removal.
     * @param {Chicken|ChickenSmall} chicken - Chicken to defeat.
     */
    killChicken(chicken) {
        chicken.die();
        setTimeout(() => this.runWhenActive(() => this.removeEnemy(chicken)), 3000);
    }

    /** Throws a bottle when input, inventory and cooldown allow it. */
    checkThrowObjects() {
        if (this.paused) return;
        if (this.keyboard.D && this.canThrowBottle()) {
            let bottle = new ThrowableObject(
                this.getBottleStartX(), this.character.y + 100, this.character.otherDirection
            );
            bottle.world = this;
            this.throwableObjects.push(bottle);
            this.character.useBottle();
            this.itemHandler.updateBottleBar();
            this.lastBottleThrow = new Date().getTime();
        }
    }

    /**
     * Calculates bottle spawn position from facing direction.
     * @returns {number} Horizontal bottle starting position.
     */
    getBottleStartX() {
        if (this.character.otherDirection) {
            return this.character.x - 50;
        }
        return this.character.x + 100;
    }

    /**
     * Checks bottle inventory and throw cooldown.
     * @returns {boolean} Whether a bottle can be thrown.
     */
    canThrowBottle() {
        const timeSinceLastThrow = new Date().getTime() - this.lastBottleThrow;
        return this.character.hasBottle() && timeSinceLastThrow >= this.bottleThrowCooldown;
    }

    /** Draws the current frame and requests the next one. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorld();
        this.drawInterface();
        this.requestNextFrame();
    }

    /** Draws all camera-relative game-world objects. */
    drawWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0)
    }

    /** Draws status bars and active end screens. */
    drawInterface() {
        this.addToMap(this.healthBar)
        this.addToMap(this.coinBar)
        this.addToMap(this.bottleBar)
        if (this.endbossBarVisible) this.addToMap(this.endbossBar)
        if (this.gameOverScreenVisible) this.drawEndScreen(this.gameOverImage);
        if (this.gameWonScreenVisible) this.drawEndScreen(this.gameWonImage);
    }

    /**
     * Draws a dimmed game result screen.
     * @param {HTMLImageElement} image - Result image to display.
     */
    drawEndScreen(image) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const imageWidth = 600;
        const imageHeight = 275;
        const imageX = (this.canvas.width - imageWidth) / 2;
        const imageY = 45;
        this.ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    }

    /** Requests another animation frame while the world is active. */
    requestNextFrame() {
        if (!this.stopped) this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    /**
     * Pauses gameplay without discarding the current world state.
     * @param {string} [reason='manual'] - Source requesting the pause.
     */
    pauseGame(reason = 'manual') {
        this.pauseManager.pause(reason);
    }

    /**
     * Releases one pause source and resumes when possible.
     * @param {string} [reason='manual'] - Source releasing the pause.
     */
    resumeGame(reason = 'manual') {
        this.pauseManager.resume(reason);
    }

    /**
     * Runs a delayed action when gameplay is active again.
     * @param {Function} callback - Delayed gameplay action.
     */
    runWhenActive(callback) {
        this.pauseManager.runWhenActive(callback);
    }

    /** Stops rendering, timers and all active game objects. */
    stopGame() {
        this.stopped = true;
        cancelAnimationFrame(this.animationFrame);
        this.clearGameTimers();
        this.stopGameObjects();
    }

    /** Clears world collision, throw and game-over timers. */
    clearGameTimers() {
        clearInterval(this.collisionInterval);
        clearInterval(this.bottleThrowInterval);
        clearTimeout(this.gameOverTimeout);
    }

    /** Stops the character, enemies and thrown bottles. */
    stopGameObjects() {
        const objects = [this.character, ...this.level.enemies, ...this.throwableObjects];
        objects.forEach((object) => this.stopGameObject(object));
    }

    /**
     * Freezes an object and clears its known animation intervals.
     * @param {MovableObject} object - Game object to stop.
     */
    stopGameObject(object) {
        if (object.freeze) object.freeze();
        clearInterval(object.movementInterval);
        clearInterval(object.animationInterval);
        clearInterval(object.deathAnimationInterval);
    }

    /**
     * Draws a collection of objects on the canvas.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    /**
     * Draws one object with optional horizontal mirroring.
     * @param {DrawableObject} mo - Object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Mirrors the canvas and object before drawing.
     * @param {DrawableObject} mo - Object to mirror.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0)
        this.ctx.scale(-1, 1)
        mo.x = mo.x * -1;
    }

    /**
     * Restores canvas and object after mirrored drawing.
     * @param {DrawableObject} mo - Mirrored object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
