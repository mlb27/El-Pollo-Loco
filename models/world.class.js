class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    throwableObjects = [];
    lastBottleThrow = 0;
    bottleThrowCooldown = 1000;
    gameOver = false;
    gameOverScreenVisible = false;
    gameOverImage = new Image();
    gameWon = false;
    gameWonScreenVisible = false;
    gameWonImage = new Image();

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.loadGameOverImage();
        this.loadGameWonImage();
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
        const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss) endboss.world = this;
    }

    loadGameOverImage() {
        this.gameOverImage.src = 'img/10_win_loss/You lost.png';
    }

    loadGameWonImage() {
        this.gameWonImage.src = 'img/10_win_loss/You won A.png';
    }

    checkCollisions() {
        this.collisionInterval = setInterval(() => this.runCollisionChecks(), 1000 / 60);
        this.bottleThrowInterval = setInterval(() => this.checkThrowObjects(), 100);
    }

    runCollisionChecks() {
        this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
        this.checkBottlePickups();
        this.checkBottleCollisions();
        this.removeExpiredBottles();
        this.checkEndbossVisibility();
    }

    startGameOver() {
        if (this.gameOver || this.gameWon) return;
        this.gameOver = true;
        audioManager.pauseBackgroundMusic();
        this.freezeGame();
        setTimeout(() => this.showGameOverScreen(), 1000);
    }

    freezeGame() {
        clearInterval(this.collisionInterval);
        clearInterval(this.bottleThrowInterval);
        this.character.freeze();
        this.level.enemies.forEach((enemy) => enemy.freeze());
        this.throwableObjects.forEach((bottle) => bottle.freeze());
    }

    showGameOverScreen() {
        this.gameOverScreenVisible = true;
        audioManager.playSound('gameOver');
    }

    startGameWon() {
        if (this.gameWon || this.gameOver) return;
        this.gameWon = true;
        audioManager.pauseBackgroundMusic();
        this.freezeGame();
    }

    showGameWonScreen() {
        if (!this.gameWon || this.gameWonScreenVisible) return;
        this.gameWonScreenVisible = true;
        audioManager.playSound('gameWon');
    }

    checkEndbossVisibility() {
        const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss && this.isVisible(endboss)) {
            endboss.startAlert();
        }
    }

    isVisible(movableObject) {
        const screenX = movableObject.x + this.camera_x;
        return screenX < this.canvas.width && screenX + movableObject.width > 0;
    }

    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken && !enemy.isDead() && this.character.isJumpingOn(enemy)) {
            this.stompChicken(enemy);
        } else if (!enemy.isDead() && this.character.isColliding(enemy) &&
            !this.character.isHurt() && !this.character.stompProtectionActive) {
            this.damageCharacter(enemy);
        }
    }

    damageCharacter(enemy) {
        this.character.hit();
        const causesKnockback = enemy instanceof Chicken || enemy instanceof Endboss;
        if (causesKnockback && !this.character.isDead()) {
            this.character.knockBackFrom(enemy);
        }
        this.healthBar.setPercentage(this.character.energy);
    }

    stompChicken(chicken) {
        this.killChicken(chicken);
        audioManager.playSound('stompSplash');
        this.character.bounceAfterStomp();
    }

    killChicken(chicken) {
        chicken.die();
        setTimeout(() => this.removeEnemy(chicken), 3000);
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyCollision(bottle, enemy);
            });
        });
    }

    handleBottleEnemyCollision(bottle, enemy) {
        if (this.canBottleHitEnemy(bottle, enemy)) this.hitEnemyWithBottle(bottle, enemy);
        else if (this.canEndbossBlockBottle(bottle, enemy)) bottle.bounceOffEndboss();
    }

    canEndbossBlockBottle(bottle, enemy) {
        return enemy instanceof Endboss && !enemy.isDead() && !enemy.canBeHit() &&
            bottle.canHitEnemy() && bottle.isColliding(enemy);
    }

    canBottleHitEnemy(bottle, enemy) {
        const canBeHit = enemy instanceof Chicken ||
            enemy instanceof Endboss && enemy.canBeHit();
        return canBeHit &&
            !enemy.isDead() && bottle.canHitEnemy() && bottle.isColliding(enemy);
    }

    hitEnemyWithBottle(bottle, enemy) {
        bottle.hitEnemy();
        if (enemy instanceof Chicken) this.killChicken(enemy);
        else this.hitEndboss(enemy);
    }

    hitEndboss(endboss) {
        endboss.hit();
        if (endboss.isDead()) this.startGameWon();
    }

    removeEnemy(enemy) {
        this.level.enemies = this.level.enemies.filter((currentEnemy) => currentEnemy !== enemy);
    }

    removeExpiredBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isExpired);
    }

    checkBottlePickups() {
        this.level.bottles.forEach((bottle) => {
            if (this.canCollectBottle(bottle)) this.collectBottle(bottle);
        });
    }

    canCollectBottle(bottle) {
        return this.character.canCollectBottle() && this.character.isColliding(bottle);
    }

    collectBottle(bottle) {
        this.character.collectBottle();
        audioManager.playSound('bottlePickup');
        this.level.bottles = this.level.bottles.filter((item) => item !== bottle);
        this.updateBottleBar();
    }

    updateBottleBar() {
        this.bottleBar.setPercentage(this.character.getBottlePercentage());
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.canThrowBottle()) {
            let bottle = new ThrowableObject(
                this.getBottleStartX(), this.character.y + 100, this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
            this.character.useBottle();
            this.updateBottleBar();
            this.lastBottleThrow = new Date().getTime();
        }
    }

    getBottleStartX() {
        if (this.character.otherDirection) {
            return this.character.x - 50;
        }
        return this.character.x + 100;
    }

    canThrowBottle() {
        const timeSinceLastThrow = new Date().getTime() - this.lastBottleThrow;
        return this.character.hasBottle() && timeSinceLastThrow >= this.bottleThrowCooldown;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorld();
        this.drawInterface();
        this.requestNextFrame();
    }

    drawWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0)
    }

    drawInterface() {
        this.addToMap(this.healthBar)
        this.addToMap(this.bottleBar)
        if (this.gameOverScreenVisible) this.drawEndScreen(this.gameOverImage);
        if (this.gameWonScreenVisible) this.drawEndScreen(this.gameWonImage);
    }

    drawEndScreen(image) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const imageWidth = 600;
        const imageHeight = 275;
        const imageX = (this.canvas.width - imageWidth) / 2;
        const imageY = (this.canvas.height - imageHeight) / 2;
        this.ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    }

    requestNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0)
        this.ctx.scale(-1, 1)
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
