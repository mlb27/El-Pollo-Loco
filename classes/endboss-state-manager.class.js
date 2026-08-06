class EndbossStateManager {
    /**
     * Creates a state manager for an endboss.
     * @param {Endboss} endboss - Endboss whose state is managed.
     */
    constructor(endboss) {
        this.endboss = endboss;
    }

    /** Saves the current interruptible endboss state. */
    save() {
        if (this.endboss.currentState === 'hurt' || this.endboss.currentState === 'dead') return;
        this.snapshot = {
            state: this.endboss.currentState,
            ...this.endboss.animation.getSnapshot(),
            speedY: this.endboss.speedY,
            attackDirection: this.endboss.attackDirection
        };
    }

    /** Clears the stored endboss state snapshot. */
    clear() {
        this.snapshot = null;
    }

    /** Resumes a stored state or continues the walking timer. */
    resume() {
        if (!this.endboss.canAct()) return;
        const snapshot = this.snapshot;
        this.clear();
        if (snapshot) this.resumeSavedState(snapshot);
        else this.endboss.resumeWalkingTimer();
    }

    /**
     * Selects the correct resume handler for a stored state.
     * @param {Object} snapshot - Stored endboss state.
     */
    resumeSavedState(snapshot) {
        if (snapshot.state === 'attacking') this.resumeAttack(snapshot);
        else if (snapshot.state === 'jumping') this.resumeAirState(snapshot, 'jumping', 'moveAttackJump');
        else if (snapshot.state === 'knockedBack') {
            this.resumeAirState(snapshot, 'knockedBack', 'moveAttackKnockback');
        } else if (snapshot.state === 'landing') this.resumeLanding(snapshot);
        else if (snapshot.state === 'alert') this.resumeAlert(snapshot);
        else this.endboss.resumeWalkingTimer();
    }

    /**
     * Resumes an interrupted attack animation.
     * @param {Object} snapshot - Stored attack state.
     */
    resumeAttack(snapshot) {
        this.endboss.attackDirection = snapshot.attackDirection;
        this.resumeFrameState(snapshot, {
            state: 'attacking',
            images: this.endboss.animation.IMAGES_ATTACK,
            duration: 200,
            onComplete: () => this.endboss.startAttackJump()
        });
    }

    /**
     * Resumes an interrupted airborne state.
     * @param {Object} snapshot - Stored airborne state.
     * @param {string} state - State name to restore.
     * @param {string} movementMethod - Movement method to continue.
     */
    resumeAirState(snapshot, state, movementMethod) {
        this.endboss.currentState = state;
        this.endboss.speedY = snapshot.speedY;
        this.endboss.attackDirection = snapshot.attackDirection;
        this.endboss.animation.showLastFrame(this.endboss.animation.IMAGES_ATTACK);
        this.endboss.jumpInterval = setInterval(() => {
            this.endboss[movementMethod]();
        }, 1000 / 60);
    }

    /**
     * Resumes an interrupted landing animation.
     * @param {Object} snapshot - Stored landing state.
     */
    resumeLanding(snapshot) {
        this.resumeFrameState(snapshot, {
            state: 'landing',
            images: this.endboss.animation.IMAGES_LANDING,
            duration: 200,
            onComplete: () => this.endboss.startWalking()
        });
    }

    /**
     * Resumes an interrupted alert animation.
     * @param {Object} snapshot - Stored alert state.
     */
    resumeAlert(snapshot) {
        this.resumeFrameState(snapshot, {
            state: 'alert',
            images: this.endboss.animation.IMAGES_ALERT,
            duration: 150,
            onComplete: () => this.endboss.holdAlertFrame()
        });
    }

    /**
     * Restores a timed frame-animation state.
     * @param {Object} snapshot - Stored frame state.
     * @param {Object} config - Animation and callback configuration.
     */
    resumeFrameState(snapshot, config) {
        this.endboss.currentState = config.state;
        this.endboss.animation.start(config.images, {
            duration: config.duration,
            onComplete: config.onComplete,
            startIndex: snapshot.frameIndex,
            firstDelay: snapshot.frameTime
        });
    }
}