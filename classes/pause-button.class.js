class PauseButton {
    /** Shows the pause control and synchronizes its current icon. */
    show(world) {
        this.getButton().hidden = false;
        this.update(world);
    }

    /** Hides the pause control outside active gameplay. */
    hide() {
        this.getButton().hidden = true;
    }

    /** Toggles the manual pause reason for the current world. */
    toggle(world) {
        const manuallyPaused = world.pauseManager.hasReason('manual');
        if (manuallyPaused) world.resumeGame('manual');
        else world.pauseGame('manual');
        this.update(world);
    }

    /** Updates icon and accessible text from the world state. */
    update(world) {
        const button = this.getButton();
        const action = world?.paused ? 'fortsetzen' : 'pausieren';
        button.classList.toggle('is-paused', Boolean(world?.paused));
        button.setAttribute('aria-label', `Spiel ${action}`);
        button.title = `Spiel ${action}`;
    }

    /**
     * Returns the pause control element.
     * @returns {HTMLButtonElement} Pause menu button.
     */
    getButton() {
        return document.getElementById('pauseGameButton');
    }
}

const pauseButton = new PauseButton();
