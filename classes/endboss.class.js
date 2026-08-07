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

    /** Creates the endboss with animation and state controllers. */
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

    /** Starts the endboss spawn and alert sequence once. */
    startAlert() {
        if (this.alertStarted || this.isDead()) return;
        this.alertStarted = true;
        this.currentState = 'alert';
        this.animation.start(this.animation.IMAGES_ALERT, {
            duration: 150,
            onComplete: () => this.holdAlertFrame()
        });
        this.spawnSoundTimeout = setTimeout(() => {
            this.world.runWhenActive(() => audioManager.playSound('endbossSpawn'));
        }, 1000);
    }

    /** Holds the final alert frame before walking starts. */
    holdAlertFrame() {
        this.alertHoldTimeout = setTimeout(() => {
            this.world.runWhenActive(() => {
                this.alertFinished = true;
                this.startWalking();
            });
        }, 500);
    }

    /**
     * Starts walking and schedules the next attack.
     * @param {boolean} [resetAttackTimer=true] - Whether to restart the attack timer.
     */
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

    /** Schedules the next attack using the current deadline. */
    scheduleAttack() {
        const attackDelay = Math.max(0, this.attackDeadline - Date.now());
        this.walkTimeout = setTimeout(() => this.startAttack(), attackDelay);
    }

    /** Moves toward the character while respecting safe distance. */
    moveTowardsCharacter() {
        if (!this.canAct()) return;
        this.updateDirection();
        this.updateCombatState();
        if (this.maintainSafeDistance()) return;
        this.animation.startWalkAnimation();
        if (this.otherDirection) this.moveRight();
        else this.moveLeft();
    }

    /** Updates the facing direction toward the character. */
    updateDirection() {
        if (!this.world) return;
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const endbossCenter = this.x + this.width / 2;
        this.otherDirection = characterCenter > endbossCenter;
    }

    /**
     * Calculates horizontal distance to the character.
     * @returns {number} Distance between endboss and character.
     */
    getDistanceToCharacter() {
        const character = this.world.character;
        if (this.otherDirection) return character.x - (this.x + this.width);
        return this.x - (character.x + character.width);
    }

    /**
     * Maintains safe distance when the character is near a map edge.
     * @returns {boolean} Whether regular movement was intercepted.
     */
    maintainSafeDistance() {
        if (!this.isCharacterNearMapEdge()) return false;
        const distance = this.getDistanceToCharacter();
        if (distance > this.safeDistance) return false;
        if (distance < this.safeDistance) this.moveAwayFromCharacter(distance);
        else this.animation.pauseWalkAnimation();
        return true;
    }

    /**
     * Moves away until the configured safe distance is restored.
     * @param {number} distance - Current distance to the character.
     */
    moveAwayFromCharacter(distance) {
        this.animation.startWalkAnimation();
        const movement = Math.min(this.speed, this.safeDistance - distance);
        if (this.otherDirection) this.x -= movement;
        else this.x += movement;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
    }

    /**
     * Checks whether the character is near either protected map edge.
     * @returns {boolean} Whether edge-distance protection is active.
     */
    isCharacterNearMapEdge() {
        const characterX = this.world.character.x;
        const levelEndX = this.world.level.level_end_x;
        const nearSpawn = Math.abs(characterX - this.characterSpawnX) <= this.mapEdgeRange;
        const nearMapEnd = levelEndX - characterX <= this.mapEdgeRange;
        return nearSpawn || nearMapEnd;
    }

    /**
     * Calculates the maximum horizontal endboss position.
     * @returns {number} Maximum allowed world position.
     */
    getMaximumX() {
        if (!this.world) return this.maximumX;
        const safeX = this.world.level.level_end_x + this.world.character.width + this.safeDistance;
        return Math.max(this.maximumX, safeX);
    }

    /** Starts or briefly delays the next endboss attack. */
    startAttack() {
        if (this.isPaused()) return this.retryAttackAfterPause();
        if (!this.canAct()) return;
        if (Date.now() < this.attackDeadline) return this.scheduleAttack();
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

    /** Retries an elapsed attack timer after gameplay resumes. */
    retryAttackAfterPause() {
        this.walkTimeout = setTimeout(() => this.startAttack(), 100);
    }

    /**
     * Checks whether combat has started and an attack may begin.
     * @returns {boolean} Whether the attack may start.
     */
    canStartAttack() {
        this.updateCombatState();
        return this.combatStarted;
    }

    /** Activates combat permanently after the character approaches. */
    updateCombatState() {
        if (this.combatStarted) return;
        if (this.getDistanceToCharacter() <= this.safeDistance) this.combatStarted = true;
    }

    /** Delays an attack until combat has been activated. */
    delayAttack() {
        this.attackDeadline = Date.now() + 100;
        if (this.currentState === 'walking') this.scheduleAttack();
        else this.startWalking(false);
    }

    /** Starts the jumping phase of an endboss attack. */
    startAttackJump() {
        if (!this.canAct()) return;
        this.currentState = 'jumping';
        audioManager.playSound('endbossJump');
        this.animation.showLastFrame(this.animation.IMAGES_ATTACK);
        this.speedY = 10.5;
        this.jumpInterval = setInterval(() => this.moveAttackJump(), 1000 / 60);
    }

    /** Moves the endboss during an attack jump. */
    moveAttackJump() {
        if (!this.canAct()) return;
        this.moveAttackTowardsCharacter();
        this.moveVertically();
    }

    /** Moves the airborne attack toward the character. */
    moveAttackTowardsCharacter() {
        const distance = this.getAttackDistance();
        if (distance !== 0) this.updateAttackDirection(distance);
        const movement = Math.min(11, Math.abs(distance));
        this.x += this.attackDirection * movement;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
    }

    /**
     * Calculates center-to-center attack distance.
     * @returns {number} Signed horizontal distance to the character.
     */
    getAttackDistance() {
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const endbossCenter = this.x + this.width / 2;
        return characterCenter - endbossCenter;
    }

    /**
     * Updates airborne attack direction from a signed distance.
     * @param {number} distance - Signed distance to the character.
     */
    updateAttackDirection(distance) {
        this.otherDirection = distance > 0;
        this.attackDirection = this.otherDirection ? 1 : -1;
    }

    /** Applies vertical attack movement and landing detection. */
    moveVertically() {
        this.y -= this.speedY;
        this.speedY -= 0.4;
        if (this.y >= this.groundY && this.speedY < 0) this.landAttack();
    }

    /** Reverses an active jump after the endboss hits the character. */
    knockBackAfterHit() {
        if (this.currentState !== 'jumping') return;
        clearInterval(this.jumpInterval);
        this.currentState = 'knockedBack';
        this.attackDirection *= -1;
        this.speedY = 6;
        this.jumpInterval = setInterval(() => this.moveAttackKnockback(), 1000 / 60);
    }

    /** Moves the endboss during attack knockback. */
    moveAttackKnockback() {
        if (!this.canAct()) return;
        this.x += this.attackDirection * 4;
        this.x = Math.max(0, Math.min(this.x, this.getMaximumX()));
        this.moveVertically();
    }

    /** Ends airborne movement and starts the landing animation. */
    landAttack() {
        clearInterval(this.jumpInterval);
        this.resetToGround();
        this.currentState = 'landing';
        this.animation.start(this.animation.IMAGES_LANDING, {
            duration: 200,
            onComplete: () => this.startWalking()
        });
    }

    /** Damages the endboss and handles hurt or death state. */
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

    /** Plays the hit sound assigned to the current damage level. */
    playEndbossHitSound() {
        const hitNumber = (120 - this.energy) / 20;
        audioManager.playSound(`endbossHit${hitNumber}`);
    }

    /** Resets combat state and starts the endboss death sequence. */
    prepareDeath() {
        this.stateManager.clear();
        this.resetToGround();
        audioManager.playSound('endbossDied');
        this.startDeathAnimation();
        this.winScreenTimeout = setTimeout(() => {
            this.world.runWhenActive(() => this.finishDeath());
        }, 1000);
    }

    /** Starts hurt animation before resuming the interrupted state. */
    startHurtAnimation() {
        this.currentState = 'hurt';
        this.animation.start(this.animation.IMAGES_HURT, {
            duration: 150,
            onComplete: () => this.stateManager.resume()
        });
    }

    /** Continues walking or attacks when the saved deadline elapsed. */
    resumeWalkingTimer() {
        if (!this.attackDeadline) this.startWalking();
        else if (Date.now() >= this.attackDeadline) this.startAttack();
        else this.startWalking(false);
    }

    /** Starts the non-looping endboss death animation. */
    startDeathAnimation() {
        this.currentState = 'dead';
        this.animation.start(this.animation.IMAGES_DEAD, { duration: 250 });
    }

    /** Shows the win screen after the death delay. */
    finishDeath() {
        if (this.world) this.world.showGameWonScreen();
    }

    /** Resets vertical position and speed to ground values. */
    resetToGround() {
        this.y = this.groundY;
        this.speedY = 0;
    }

    /** Stops endboss walking movement, animation and sound. */
    stopWalking() {
        this.animation.pauseWalkAnimation();
        clearInterval(this.movementInterval);
        clearTimeout(this.walkTimeout);
    }

    /** Stops all timers associated with the current action. */
    stopActionTimers() {
        this.animation.stopFrameAnimation();
        this.stopWalking();
        clearInterval(this.jumpInterval);
        clearTimeout(this.alertHoldTimeout);
    }

    /**
     * Calculates the remaining endboss energy percentage.
     * @returns {number} Remaining endboss energy percentage.
     */
    getEnergyPercentage() {
        return this.energy / 120 * 100;
    }

    /**
     * Checks whether the endboss may perform an action.
     * @returns {boolean} Whether the endboss is active and alive.
     */
    canAct() {
        return !this.isFrozen && !this.isPaused() && !this.isDead();
    }

    /**
     * Checks whether spawn protection has ended.
     * @returns {boolean} Whether the endboss can receive damage.
     */
    canBeHit() {
        return this.alertFinished && !this.isDead();
    }

    /** Freezes endboss movement, sounds and active timers. */
    freeze() {
        super.freeze();
        this.stopWalking();
        clearInterval(this.jumpInterval);
        clearTimeout(this.alertHoldTimeout);
        clearTimeout(this.spawnSoundTimeout);
        if (this.currentState !== 'dead') this.animation.stopFrameAnimation();
    }
}
