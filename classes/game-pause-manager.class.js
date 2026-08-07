class GamePauseManager {
    pauseReasons = new Set();
    /**
     * Creates a pause manager for one game world.
     * @param {World} world - World whose state is controlled.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Pauses gameplay for a selected source.
     * @param {string} [reason='manual'] - Source requesting the pause.
     */
    pause(reason = 'manual') {
        if (this.world.stopped) return;
        const alreadyPaused = this.pauseReasons.size > 0;
        this.pauseReasons.add(reason);
        if (alreadyPaused) return;
        this.world.paused = true;
        this.pauseStartedAt = Date.now();
        this.clearKeyboard();
        audioManager.pauseGameAudio();
    }

    /**
     * Releases one pause source and resumes when none remain.
     * @param {string} [reason='manual'] - Source releasing the pause.
     */
    resume(reason = 'manual') {
        this.pauseReasons.delete(reason);
        if (this.pauseReasons.size || !this.world.paused || this.world.stopped) return;
        this.shiftGameClocks(Date.now() - this.pauseStartedAt);
        this.world.paused = false;
        audioManager.resumeGameAudio();
    }

    /**
     * Checks whether a specific source currently pauses the game.
     * @param {string} reason - Pause source to check.
     * @returns {boolean} Whether the pause source is active.
     */
    hasReason(reason) {
        return this.pauseReasons.has(reason);
    }

    /** Releases every active keyboard or touch input. */
    clearKeyboard() {
        Object.keys(this.world.keyboard).forEach((key) => this.world.keyboard[key] = false);
    }

    /**
     * Shifts timestamps so cooldowns do not elapse during a pause.
     * @param {number} pauseDuration - Elapsed pause time in milliseconds.
     */
    shiftGameClocks(pauseDuration) {
        const character = this.world.character;
        this.world.lastBottleThrow += pauseDuration;
        character.lastActionTime += pauseDuration;
        character.lastIdleFrameTime += pauseDuration;
        if (character.lastHit) character.lastHit += pauseDuration;
        this.shiftEndbossClocks(pauseDuration);
    }

    /**
     * Shifts active endboss animation and attack deadlines.
     * @param {number} pauseDuration - Elapsed pause time in milliseconds.
     */
    shiftEndbossClocks(pauseDuration) {
        const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss?.attackDeadline) endboss.attackDeadline += pauseDuration;
        if (endboss?.animation.frameDeadline) endboss.animation.frameDeadline += pauseDuration;
    }

    /**
     * Runs a callback after gameplay resumes.
     * @param {Function} callback - Delayed gameplay action.
     */
    runWhenActive(callback) {
        if (this.world.stopped) return;
        if (this.world.paused) setTimeout(() => this.runWhenActive(callback), 100);
        else callback();
    }
}
