let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;
const backgroundMusic = new Audio('audio/soundtrack.mp3');

function init() {
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard);
    updateSoundButton();
    startBackgroundMusic();
}

function startBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    resumeBackgroundMusic();
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

function resumeBackgroundMusic() {
    backgroundMusic.play().catch(waitForMusicInteraction);
}

function waitForMusicInteraction() {
    document.addEventListener('pointerdown', playBackgroundMusic, { once: true });
    document.addEventListener('keydown', playBackgroundMusic, { once: true });
}

function playBackgroundMusic() {
    backgroundMusic.play();
    document.removeEventListener('pointerdown', playBackgroundMusic);
    document.removeEventListener('keydown', playBackgroundMusic);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
    updateSoundState();
}

function updateSoundButton() {
    const soundButton = document.getElementById('soundButton');
    const soundAction = soundEnabled ? 'ausschalten' : 'einschalten';
    soundButton.textContent = soundEnabled ? '🔊' : '🔇';
    soundButton.setAttribute('aria-label', `Sounds ${soundAction}`);
    soundButton.title = `Sounds ${soundAction}`;
}

function updateSoundState() {
    getGameSounds().forEach((sound) => {
        sound.muted = !soundEnabled;
        if (!soundEnabled && sound !== backgroundMusic) stopSound(sound);
    });
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function getGameSounds() {
    if (!world) return [];
    const characterSounds = [
        world.character.jumpSound, world.character.hitSound,
        world.character.oughSound, world.character.diedSound
    ];
    const enemySounds = world.level.enemies.flatMap((enemy) => [
        enemy.hitSound, enemy.stompSplashSound, enemy.spawnSound
    ]);
    const bottleSounds = world.throwableObjects.flatMap((bottle) => [
        bottle.throwSound, bottle.hitSound, bottle.landSound
    ]);
    return [
        backgroundMusic, world.gameOverSound,
        ...characterSounds, ...enemySounds, ...bottleSounds
    ].filter(Boolean);
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
