class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
        }, 1000 / 60);

        setInterval(() => {
            this.checkThrowObjects();
        }, 100);
    }

    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken && !enemy.isDead() && this.character.isJumpingOn(enemy)) {
            this.killChicken(enemy);
        } else if (!enemy.isDead() && this.character.isColliding(enemy) && !this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    killChicken(chicken) {
        chicken.die();
        this.character.jump();
        setTimeout(() => this.removeEnemy(chicken), 3000);
    }

    removeEnemy(enemy) {
        this.level.enemies = this.level.enemies.filter((currentEnemy) => currentEnemy !== enemy);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100)
            this.throwableObjects.push(bottle);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar)
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character)
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0)

        // Draw () wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw(); // this gibt es nicht in requestAnimationFrame
        });
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
