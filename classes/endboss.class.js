class Endboss extends MovableObject {
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemy_boss_chicken/2_alert/G5.png',
        'img/4_enemy_boss_chicken/2_alert/G6.png',
        'img/4_enemy_boss_chicken/2_alert/G7.png',
        'img/4_enemy_boss_chicken/2_alert/G8.png',
        'img/4_enemy_boss_chicken/2_alert/G9.png',
        'img/4_enemy_boss_chicken/2_alert/G10.png',
        'img/4_enemy_boss_chicken/2_alert/G11.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemy_boss_chicken/3_attack/G13.png',
        'img/4_enemy_boss_chicken/3_attack/G14.png',
        'img/4_enemy_boss_chicken/3_attack/G15.png',
        'img/4_enemy_boss_chicken/3_attack/G16.png',
        'img/4_enemy_boss_chicken/3_attack/G17.png',
        'img/4_enemy_boss_chicken/3_attack/G18.png'
    ];

    IMAGES_LANDING = [
        'img/4_enemy_boss_chicken/3_attack/G19.png',
        'img/4_enemy_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];

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
    interruptedState;
    displayedFrameIndex = 0;
    animationFrameDeadline = 0;

    constructor() {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadEndbossImages();
        this.x = 3200;
        this.y = this.groundY;
        this.width = 250;
        this.height = 400;
    }

    loadEndbossImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_LANDING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    startAlert() {
        if (this.alertStarted || this.isDead()) return;
        this.alertStarted = true;
        this.currentState = 'alert';
        this.startFrameAnimation(this.IMAGES_ALERT, 150, () => this.holdAlertFrame());
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
        this.startWalkAnimation();
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
        this.startWalkAnimation();
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
        else this.pauseWalkAnimation();
        return true;
    }

    moveAwayFromCharacter(distance) {
        this.startWalkAnimation();
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

    startWalkAnimation() {
        audioManager.playLoopingSound('endbossWalking');
        if (this.walkAnimationInterval) return;
        this.walkAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

    pauseWalkAnimation() {
        clearInterval(this.walkAnimationInterval);
        this.walkAnimationInterval = null;
        audioManager.stopLoopingSound('endbossWalking');
    }

    startAttack() {
        if (!this.canAct()) return;
        this.updateDirection();
        if (!this.canStartAttack()) {
            this.delayAttack();
            return;
        }
        this.stopActionTimers();
        this.currentState = 'attacking';
        this.attackDirection = this.otherDirection ? 1 : -1;
        audioManager.playSound('endbossPrepare');
        this.startFrameAnimation(this.IMAGES_ATTACK, 200, () => this.startAttackJump());
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
        const lastAttackImage = this.IMAGES_ATTACK[this.IMAGES_ATTACK.length - 1];
        this.img = this.imageCache[lastAttackImage];
        this.speedY = 10.5;
        this.jumpInterval = setInterval(() => this.moveAttackJump(), 1000 / 60);
    }

    moveAttackJump() {
        if (!this.canAct()) return;
        this.moveAttackTowardsCharacter();
        this.y -= this.speedY;
        this.speedY -= 0.4;
        if (this.y >= this.groundY && this.speedY < 0) this.landAttack();
    }

    moveAttackTowardsCharacter() {
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const endbossCenter = this.x + this.width / 2;
        const distance = characterCenter - endbossCenter;
        if (distance !== 0) {
            this.otherDirection = distance > 0;
            this.attackDirection = this.otherDirection ? 1 : -1;
        }
        const movement = Math.min(11, Math.abs(distance));
        this.x += this.attackDirection * movement;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
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
        this.y -= this.speedY;
        this.speedY -= 0.4;
        if (this.y >= this.groundY && this.speedY < 0) this.landAttack();
    }

    landAttack() {
        clearInterval(this.jumpInterval);
        this.y = this.groundY;
        this.speedY = 0;
        this.currentState = 'landing';
        this.startFrameAnimation(this.IMAGES_LANDING, 200, () => this.startWalking());
    }

    hit() {
        if (this.isDead()) return;
        this.saveInterruptedState();
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

    saveInterruptedState() {
        if (this.currentState === 'hurt' || this.currentState === 'dead') return;
        this.interruptedState = this.createStateSnapshot();
    }

    createStateSnapshot() {
        return {
            state: this.currentState,
            frameIndex: this.displayedFrameIndex,
            frameTime: Math.max(0, this.animationFrameDeadline - Date.now()),
            speedY: this.speedY,
            attackDirection: this.attackDirection
        };
    }

    prepareDeath() {
        this.interruptedState = null;
        this.resetToGround();
        audioManager.playSound('endbossDied');
        this.startDeathAnimation();
        this.winScreenTimeout = setTimeout(() => this.finishDeath(), 1000);
    }

    startHurtAnimation() {
        this.currentState = 'hurt';
        this.startFrameAnimation(this.IMAGES_HURT, 150, () => this.resumeInterruptedState());
    }

    resumeInterruptedState() {
        if (!this.canAct()) return;
        const stateSnapshot = this.interruptedState;
        this.interruptedState = null;
        if (stateSnapshot) this.resumeSavedState(stateSnapshot);
        else this.resumeWalkingTimer();
    }

    resumeSavedState(stateSnapshot) {
        if (stateSnapshot.state === 'attacking') this.resumeAttack(stateSnapshot);
        else if (stateSnapshot.state === 'jumping') this.resumeJump(stateSnapshot);
        else if (stateSnapshot.state === 'knockedBack') this.resumeAttackKnockback(stateSnapshot);
        else if (stateSnapshot.state === 'landing') this.resumeLanding(stateSnapshot);
        else if (stateSnapshot.state === 'alert') this.resumeAlert(stateSnapshot);
        else this.resumeWalkingTimer();
    }

    resumeWalkingTimer() {
        if (!this.attackDeadline) this.startWalking();
        else if (Date.now() >= this.attackDeadline) this.startAttack();
        else this.startWalking(false);
    }

    resumeAttack(stateSnapshot) {
        this.currentState = 'attacking';
        this.attackDirection = stateSnapshot.attackDirection;
        this.startFrameAnimation(
            this.IMAGES_ATTACK, 200, () => this.startAttackJump(),
            stateSnapshot.frameIndex, stateSnapshot.frameTime
        );
    }

    resumeJump(stateSnapshot) {
        this.currentState = 'jumping';
        this.speedY = stateSnapshot.speedY;
        this.attackDirection = stateSnapshot.attackDirection;
        const lastImage = this.IMAGES_ATTACK[this.IMAGES_ATTACK.length - 1];
        this.img = this.imageCache[lastImage];
        this.jumpInterval = setInterval(() => this.moveAttackJump(), 1000 / 60);
    }

    resumeAttackKnockback(stateSnapshot) {
        this.currentState = 'knockedBack';
        this.speedY = stateSnapshot.speedY;
        this.attackDirection = stateSnapshot.attackDirection;
        const lastImage = this.IMAGES_ATTACK[this.IMAGES_ATTACK.length - 1];
        this.img = this.imageCache[lastImage];
        this.jumpInterval = setInterval(() => this.moveAttackKnockback(), 1000 / 60);
    }

    resumeLanding(stateSnapshot) {
        this.currentState = 'landing';
        this.startFrameAnimation(
            this.IMAGES_LANDING, 200, () => this.startWalking(),
            stateSnapshot.frameIndex, stateSnapshot.frameTime
        );
    }

    resumeAlert(stateSnapshot) {
        this.currentState = 'alert';
        this.startFrameAnimation(
            this.IMAGES_ALERT, 150, () => this.holdAlertFrame(),
            stateSnapshot.frameIndex, stateSnapshot.frameTime
        );
    }

    startDeathAnimation() {
        this.currentState = 'dead';
        this.startFrameAnimation(this.IMAGES_DEAD, 250, null);
    }

    finishDeath() {
        if (this.world) this.world.showGameWonScreen();
    }

    resetToGround() {
        this.y = this.groundY;
        this.speedY = 0;
    }

    startFrameAnimation(images, frameDuration, onComplete, startIndex = 0, firstDelay = frameDuration) {
        this.stopFrameAnimation();
        this.animationImages = images;
        this.animationFrameDuration = frameDuration;
        this.animationCallback = onComplete;
        this.currentImage = startIndex;
        this.showAnimationFrame(firstDelay);
    }

    showAnimationFrame(frameDelay) {
        this.displayedFrameIndex = this.currentImage;
        const path = this.animationImages[this.currentImage];
        this.img = this.imageCache[path];
        this.animationFrameDeadline = Date.now() + frameDelay;
        this.animationTimer = setTimeout(() => this.advanceAnimationFrame(), frameDelay);
    }

    advanceAnimationFrame() {
        const lastImageIndex = this.animationImages.length - 1;
        if (this.displayedFrameIndex < lastImageIndex) {
            this.currentImage = this.displayedFrameIndex + 1;
            this.showAnimationFrame(this.animationFrameDuration);
        } else this.runAnimationCallback();
    }

    runAnimationCallback() {
        const callback = this.animationCallback;
        this.animationCallback = null;
        if (callback) callback();
    }

    stopFrameAnimation() {
        clearTimeout(this.animationTimer);
        this.animationCallback = null;
    }

    stopWalking() {
        this.pauseWalkAnimation();
        clearInterval(this.movementInterval);
        clearTimeout(this.walkTimeout);
    }

    stopActionTimers() {
        this.stopFrameAnimation();
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
        if (this.currentState !== 'dead') this.stopFrameAnimation();
    }
}
