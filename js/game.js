let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard);
    updateAudioButtons();
    audioManager.startBackgroundMusic();
}

function toggleSoundEffects() {
    audioManager.toggleSoundEffects();
    updateSoundEffectsButton();
}

function toggleMusic() {
    audioManager.toggleMusic();
    updateMusicButton();
}

function updateAudioButtons() {
    updateSoundEffectsButton();
    updateMusicButton();
}

function updateSoundEffectsButton() {
    updateAudioButton('soundEffectsButton', audioManager.soundEffectsEnabled, 'Soundeffekte');
}

function updateMusicButton() {
    updateAudioButton('musicButton', audioManager.musicEnabled, 'Soundtrack');
}

function updateAudioButton(buttonId, enabled, label) {
    const button = document.getElementById(buttonId);
    const soundAction = enabled ? 'ausschalten' : 'einschalten';
    button.classList.toggle('is-enabled', enabled);
    button.setAttribute('aria-label', `${label} ${soundAction}`);
    button.setAttribute('aria-pressed', enabled);
    button.title = `${label} ${soundAction}`;
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
});
