class Endboss extends MovableObject {
    world;
    groundY = 55;
    maximumX = 3200;
    speed = 1.8;
    energy = 120;
    safeDistance = 200;
    mapEdgeRange = 150;
    characterSpawnX = 120;
    alertStarted = false;
    alertFinished = false;
    currentState = 'waiting';
    attackDeadline = 0;
    attackDirection = -1;
    combatStarted = false;

    constructor() {
        super();
        this.animation = new EndbossAnimation(this);
        this.stateManager = new EndbossStateManager(this);
        this.loadImage(this.animation.IMAGES_ALERT[0]);
        this.x = 3200;
        this.y = this.groundY;
        this.width = 250;
        this.height = 400;
    }

    startAlert() {
        if (this.alertStarted || this.isDead()) return;
        this.alertStarted = true;
        this.currentState = 'alert';
        this.animation.start(this.animation.IMAGES_ALERT, {
            duration: 150,
            onComplete: () => this.holdAlertFrame()
        });
        this.spawnSoundTimeout = setTimeout(() => {
            audioManager.playSound('endbossSpawn');
        }, 1000);
    }

    holdAlertFrame() {
        this.alertHoldTimeout = setTimeout(() => {
            this.alertFinished = true;
            this.startWalking();
        }, 500);
    }

    startWalking(resetAttackTimer = true) {
        if (!this.canAct()) return;
        this.stopActionTimers();
        this.currentState = 'walking';
        this.currentImage = 0;
        if (resetAttackTimer) this.attackDeadline = Date.now() + 900;
        this.animation.startWalkAnimation();
        this.movementInterval = setInterval(() => this.moveTowardsCharacter(), 1000 / 60);
        this.scheduleAttack();
    }

    scheduleAttack() {
        const attackDelay = Math.max(0, this.attackDeadline - Date.now());
        this.walkTimeout = setTimeout(() => this.startAttack(), attackDelay);
    }

    moveTowardsCharacter() {
        this.updateDirection();
        this.updateCombatState();
        if (this.maintainSafeDistance()) return;
        this.animation.startWalkAnimation();
        if (this.otherDirection) this.moveRight();
        else this.moveLeft();
    }

    updateDirection() {
        if (!this.world) return;
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const endbossCenter = this.x + this.width / 2;
        this.otherDirection = characterCenter > endbossCenter;
    }

    getDistanceToCharacter() {
        const character = this.world.character;
        if (this.otherDirection) return character.x - (this.x + this.width);
        return this.x - (character.x + character.width);
    }

    maintainSafeDistance() {
        if (!this.isCharacterNearMapEdge()) return false;
        const distance = this.getDistanceToCharacter();
        if (distance > this.safeDistance) return false;
        if (distance < this.safeDistance) this.moveAwayFromCharacter(distance);
        else this.animation.pauseWalkAnimation();
        return true;
    }

    moveAwayFromCharacter(distance) {
        this.animation.startWalkAnimation();
        const movement = Math.min(this.speed, this.safeDistance - distance);
        if (this.otherDirection) this.x -= movement;
        else this.x += movement;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
    }

    isCharacterNearMapEdge() {
        const characterX = this.world.character.x;
        const levelEndX = this.world.level.level_end_x;
        const nearSpawn = Math.abs(characterX - this.characterSpawnX) <= this.mapEdgeRange;
        const nearMapEnd = levelEndX - characterX <= this.mapEdgeRange;
        return nearSpawn || nearMapEnd;
    }

    getMaximumX() {
        if (!this.world) return this.maximumX;
        const safeX = this.world.level.level_end_x + this.world.character.width + this.safeDistance;
        return Math.max(this.maximumX, safeX);
    }

    startAttack() {
        if (!this.canAct()) return;
        this.updateDirection();
        if (!this.canStartAttack()) return this.delayAttack();
        this.stopActionTimers();
        this.currentState = 'attacking';
        this.attackDirection = this.otherDirection ? 1 : -1;
        audioManager.playSound('endbossPrepare');
        this.animation.start(this.animation.IMAGES_ATTACK, {
            duration: 200,
            onComplete: () => this.startAttackJump()
        });
    }

    canStartAttack() {
        this.updateCombatState();
        return this.combatStarted;
    }

    updateCombatState() {
        if (this.combatStarted) return;
        if (this.getDistanceToCharacter() <= this.safeDistance) this.combatStarted = true;
    }

    delayAttack() {
        this.attackDeadline = Date.now() + 100;
        if (this.currentState === 'walking') this.scheduleAttack();
        else this.startWalking(false);
    }

    startAttackJump() {
        if (!this.canAct()) return;
        this.currentState = 'jumping';
        audioManager.playSound('endbossJump');
        this.animation.showLastFrame(this.animation.IMAGES_ATTACK);
        this.speedY = 10.5;
        this.jumpInterval = setInterval(() => this.moveAttackJump(), 1000 / 60);
    }

    moveAttackJump() {
        if (!this.canAct()) return;
        this.moveAttackTowardsCharacter();
        this.moveVertically();
    }

    moveAttackTowardsCharacter() {
        const distance = this.getAttackDistance();
        if (distance !== 0) this.updateAttackDirection(distance);
        const movement = Math.min(11, Math.abs(distance));
        this.x += this.attackDirection * movement;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
    }

    getAttackDistance() {
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const endbossCenter = this.x + this.width / 2;
        return characterCenter - endbossCenter;
    }

    updateAttackDirection(distance) {
        this.otherDirection = distance > 0;
        this.attackDirection = this.otherDirection ? 1 : -1;
    }

    moveVertically() {
        this.y -= this.speedY;
        this.speedY -= 0.4;
        if (this.y >= this.groundY && this.speedY < 0) this.landAttack();
    }

    knockBackAfterHit() {
        if (this.currentState !== 'jumping') return;
        clearInterval(this.jumpInterval);
        this.currentState = 'knockedBack';
        this.attackDirection *= -1;
        this.speedY = 6;
        this.jumpInterval = setInterval(() => this.moveAttackKnockback(), 1000 / 60);
    }

    moveAttackKnockback() {
        if (!this.canAct()) return;
        this.x += this.attackDirection * 4;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
        this.moveVertically();
    }

    landAttack() {
        clearInterval(this.jumpInterval);
        this.resetToGround();
        this.currentState = 'landing';
        this.animation.start(this.animation.IMAGES_LANDING, {
            duration: 200,
            onComplete: () => this.startWalking()
        });
    }

    hit() {
        if (this.isDead()) return;
        this.stateManager.save();
        super.hit();
        this.stopActionTimers();
        if (this.isDead()) this.prepareDeath();
        else {
            this.playEndbossHitSound();
            this.startHurtAnimation();
        }
    }

    playEndbossHitSound() {
        const hitNumber = (120 - this.energy) / 20;
        audioManager.playSound(`endbossHit${hitNumber}`);
    }

    prepareDeath() {
        this.stateManager.clear();
        this.resetToGround();
        audioManager.playSound('endbossDied');
        this.startDeathAnimation();
        this.winScreenTimeout = setTimeout(() => this.finishDeath(), 1000);
    }

    startHurtAnimation() {
        this.currentState = 'hurt';
        this.animation.start(this.animation.IMAGES_HURT, {
            duration: 150,
            onComplete: () => this.stateManager.resume()
        });
    }

    resumeWalkingTimer() {
        if (!this.attackDeadline) this.startWalking();
        else if (Date.now() >= this.attackDeadline) this.startAttack();
        else this.startWalking(false);
    }

    startDeathAnimation() {
        this.currentState = 'dead';
        this.animation.start(this.animation.IMAGES_DEAD, { duration: 250 });
    }

    finishDeath() {
        if (this.world) this.world.showGameWonScreen();
    }

    resetToGround() {
        this.y = this.groundY;
        this.speedY = 0;
    }

    stopWalking() {
        this.animation.pauseWalkAnimation();
        clearInterval(this.movementInterval);
        clearTimeout(this.walkTimeout);
    }

    stopActionTimers() {
        this.animation.stopFrameAnimation();
        this.stopWalking();
        clearInterval(this.jumpInterval);
        clearTimeout(this.alertHoldTimeout);
    }

    getEnergyPercentage() {
        return this.energy / 120 * 100;
    }

    canAct() {
        return !this.isFrozen && !this.isDead();
    }

    canBeHit() {
        return this.alertFinished && !this.isDead();
    }

    freeze() {
        super.freeze();
        this.stopWalking();
        clearInterval(this.jumpInterval);
        clearTimeout(this.alertHoldTimeout);
        clearTimeout(this.spawnSoundTimeout);
        if (this.currentState !== 'dead') this.animation.stopFrameAnimation();
    }
}