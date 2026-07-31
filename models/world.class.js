class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    lastBottleThrow = 0;
    bottleThrowCooldown = 1000;
    gameOver = false;
    gameOverScreenVisible = false;
    gameOverImage = new Image();
    gameOverSound = new Audio('audio/game-youlose.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.loadGameOverImage();
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    loadGameOverImage() {
        this.gameOverImage.src = 'img/10_win_loss/You lost.png';
    }

    checkCollisions() {
        this.collisionInterval = setInterval(() => {
            this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
            this.checkBottleCollisions();
            this.removeExpiredBottles();
            this.checkEndbossVisibility();
        }, 1000 / 60);

        this.bottleThrowInterval = setInterval(() => {
            this.checkThrowObjects();
        }, 100);
    }

    startGameOver() {
        if (this.gameOver) return;
        this.gameOver = true;
        pauseBackgroundMusic();
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
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }

    checkEndbossVisibility() {
        const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss && this.isVisible(endboss)) {
            endboss.playSpawnSound();
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
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    stompChicken(chicken) {
        this.killChicken(chicken);
        chicken.playStompSound();
        this.character.bounceAfterStomp();
    }

    killChicken(chicken) {
        chicken.die();
        setTimeout(() => this.removeEnemy(chicken), 3000);
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (this.canBottleHitChicken(bottle, enemy)) this.hitChickenWithBottle(bottle, enemy);
            });
        });
    }

    canBottleHitChicken(bottle, enemy) {
        return enemy instanceof Chicken &&
            !enemy.isDead() && bottle.canHitEnemy() && bottle.isColliding(enemy);
    }

    hitChickenWithBottle(bottle, chicken) {
        bottle.hitEnemy();
        this.killChicken(chicken);
    }

    removeEnemy(enemy) {
        this.level.enemies = this.level.enemies.filter((currentEnemy) => currentEnemy !== enemy);
    }

    removeExpiredBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isExpired);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.canThrowBottle()) {
            let bottle = new ThrowableObject(
                this.getBottleStartX(), this.character.y + 100, this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
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
        return timeSinceLastThrow >= this.bottleThrowCooldown;
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
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0)
    }

    drawInterface() {
        this.addToMap(this.statusBar)
        if (this.gameOverScreenVisible) this.drawGameOverScreen();
    }

    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const imageWidth = 600;
        const imageHeight = 275;
        const imageX = (this.canvas.width - imageWidth) / 2;
        const imageY = (this.canvas.height - imageHeight) / 2;
        this.ctx.drawImage(this.gameOverImage, imageX, imageY, imageWidth, imageHeight);
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
