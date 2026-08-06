class EndbossStateManager {
    constructor(endboss) {
        this.endboss = endboss;
    }

    save() {
        if (this.endboss.currentState === 'hurt' || this.endboss.currentState === 'dead') return;
        this.snapshot = {
            state: this.endboss.currentState,
            ...this.endboss.animation.getSnapshot(),
            speedY: this.endboss.speedY,
            attackDirection: this.endboss.attackDirection
        };
    }

    clear() {
        this.snapshot = null;
    }

    resume() {
        if (!this.endboss.canAct()) return;
        const snapshot = this.snapshot;
        this.clear();
        if (snapshot) this.resumeSavedState(snapshot);
        else this.endboss.resumeWalkingTimer();
    }

    resumeSavedState(snapshot) {
        if (snapshot.state === 'attacking') this.resumeAttack(snapshot);
        else if (snapshot.state === 'jumping') this.resumeAirState(snapshot, 'jumping', 'moveAttackJump');
        else if (snapshot.state === 'knockedBack') {
            this.resumeAirState(snapshot, 'knockedBack', 'moveAttackKnockback');
        } else if (snapshot.state === 'landing') this.resumeLanding(snapshot);
        else if (snapshot.state === 'alert') this.resumeAlert(snapshot);
        else this.endboss.resumeWalkingTimer();
    }

    resumeAttack(snapshot) {
        this.endboss.attackDirection = snapshot.attackDirection;
        this.resumeFrameState(snapshot, {
            state: 'attacking',
            images: this.endboss.animation.IMAGES_ATTACK,
            duration: 200,
            onComplete: () => this.endboss.startAttackJump()
        });
    }

    resumeAirState(snapshot, state, movementMethod) {
        this.endboss.currentState = state;
        this.endboss.speedY = snapshot.speedY;
        this.endboss.attackDirection = snapshot.attackDirection;
        this.endboss.animation.showLastFrame(this.endboss.animation.IMAGES_ATTACK);
        this.endboss.jumpInterval = setInterval(() => {
            this.endboss[movementMethod]();
        }, 1000 / 60);
    }

    resumeLanding(snapshot) {
        this.resumeFrameState(snapshot, {
            state: 'landing',
            images: this.endboss.animation.IMAGES_LANDING,
            duration: 200,
            onComplete: () => this.endboss.startWalking()
        });
    }

    resumeAlert(snapshot) {
        this.resumeFrameState(snapshot, {
            state: 'alert',
            images: this.endboss.animation.IMAGES_ALERT,
            duration: 150,
            onComplete: () => this.endboss.holdAlertFrame()
        });
    }

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