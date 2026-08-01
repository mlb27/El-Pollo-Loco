class AudioManager {
    soundEnabled = true;
    sounds = {
        backgroundMusic: new Audio('audio/soundtrack.mp3'),
        characterJump1: new Audio('audio/character-jump1.mp3'),
        characterJump2: new Audio('audio/character-jump2.mp3'),
        characterJump3: new Audio('audio/character-jump3.mp3'),
        characterHit: new Audio('audio/character-hit.mp3'),
        characterHit1: new Audio('audio/character-hit1.mp3'),
        characterHit2: new Audio('audio/character-hit2.mp3'),
        characterHit3: new Audio('audio/character-hit3.mp3'),
        characterHit4: new Audio('audio/character-hit4.mp3'),
        characterDied: new Audio('audio/character-died.mp3'),
        chickenHit: new Audio('audio/chicken-hit.mp3'),
        stompSplash: new Audio('audio/stomp-splash.mp3'),
        endbossSpawn: new Audio('audio/endboss-spawn.mp3'),
        endbossThrowableBlocked: new Audio('audio/endboss-throwable-blocked.mp3'),
        bottleThrow: new Audio('audio/bottle-throw.mp3'),
        bottlePickup: new Audio('audio/bottle-pickup.mp3'),
        bottleHit: new Audio('audio/bottle-hit.mp3'),
        bottleLand: new Audio('audio/bottle-land.mp3'),
        gameOver: new Audio('audio/game-youlose.mp3'),
        gameWon: new Audio('audio/game-youwin.mp3')
    };

    constructor() {
        this.playBackgroundMusic = this.playBackgroundMusic.bind(this);
    }

    startBackgroundMusic() {
        const backgroundMusic = this.sounds.backgroundMusic;
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.2;
        this.resumeBackgroundMusic();
    }

    pauseBackgroundMusic() {
        this.sounds.backgroundMusic.pause();
    }

    resumeBackgroundMusic() {
        const backgroundMusic = this.sounds.backgroundMusic;
        backgroundMusic.play().catch(() => this.waitForMusicInteraction());
    }

    waitForMusicInteraction() {
        document.addEventListener('pointerdown', this.playBackgroundMusic, { once: true });
        document.addEventListener('keydown', this.playBackgroundMusic, { once: true });
    }

    playBackgroundMusic() {
        this.sounds.backgroundMusic.play();
        document.removeEventListener('pointerdown', this.playBackgroundMusic);
        document.removeEventListener('keydown', this.playBackgroundMusic);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundState();
    }

    updateSoundState() {
        Object.values(this.sounds).forEach((sound) => sound.muted = !this.soundEnabled);
        if (!this.soundEnabled) this.stopSoundEffects();
    }

    stopSoundEffects() {
        Object.entries(this.sounds)
            .filter(([soundName]) => soundName !== 'backgroundMusic')
            .forEach(([, sound]) => this.stopAudio(sound));
    }

    playSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !this.soundEnabled) return;
        sound.currentTime = 0;
        sound.play();
    }

    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) this.stopAudio(sound);
    }

    stopAudio(sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

const audioManager = new AudioManager();
