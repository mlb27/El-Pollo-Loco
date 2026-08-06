class AudioManager {
    soundEffectsEnabled = true;
    musicEnabled = true;
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
        endbossHit1: new Audio('audio/endboss-hit1.mp3'),
        endbossHit2: new Audio('audio/endboss-hit2.mp3'),
        endbossHit3: new Audio('audio/endboss-hit3.mp3'),
        endbossHit4: new Audio('audio/endboss-hit4.mp3'),
        endbossHit5: new Audio('audio/endboss-hit5.mp3'),
        endbossDied: new Audio('audio/endboss-died.mp3'),
        endbossWalking: new Audio('audio/endboss-walking.mp3'),
        endbossPrepare: new Audio('audio/endboss-prepare.mp3'),
        endbossJump: new Audio('audio/endboss-jump.mp3'),
        endbossThrowableBlocked: new Audio('audio/endboss-throwable-blocked.mp3'),
        bottleThrow: new Audio('audio/bottle-throw.mp3'),
        bottlePickup: new Audio('audio/bottle-pickup.mp3'),
        coinPickup: new Audio('audio/coin.mp3'),
        bottleHit: new Audio('audio/bottle-hit.mp3'),
        bottleLand: new Audio('audio/bottle-land.mp3'),
        gameOver: new Audio('audio/game-youlose.mp3'),
        gameWon: new Audio('audio/game-youwin.mp3')
    };

    constructor() {
        this.playBackgroundMusic = this.playBackgroundMusic.bind(this);
        this.loadSoundSettings();
        this.updateAudioState();
    }

    loadSoundSettings() {
        this.soundEffectsEnabled = this.getSoundSetting('soundEffectsEnabled');
        this.musicEnabled = this.getSoundSetting('musicEnabled');
    }

    getSoundSetting(settingName) {
        const savedSetting = localStorage.getItem(settingName);
        if (savedSetting !== null) return savedSetting === 'true';
        return this.getLegacySoundSetting();
    }

    getLegacySoundSetting() {
        const savedSetting = localStorage.getItem('soundEnabled');
        return savedSetting === null || savedSetting === 'true';
    }

    saveSoundSetting(settingName, settingValue) {
        localStorage.setItem(settingName, settingValue);
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

    toggleSoundEffects() {
        this.soundEffectsEnabled = !this.soundEffectsEnabled;
        this.saveSoundSetting('soundEffectsEnabled', this.soundEffectsEnabled);
        this.updateSoundEffectsState();
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveSoundSetting('musicEnabled', this.musicEnabled);
        this.updateMusicState();
    }

    updateAudioState() {
        this.updateSoundEffectsState();
        this.updateMusicState();
    }

    updateSoundEffectsState() {
        const soundEffects = this.getSoundEffects();
        soundEffects.forEach((sound) => sound.muted = !this.soundEffectsEnabled);
        if (!this.soundEffectsEnabled) this.stopSoundEffects();
    }

    updateMusicState() {
        this.sounds.backgroundMusic.muted = !this.musicEnabled;
    }

    getSoundEffects() {
        return Object.entries(this.sounds)
            .filter(([soundName]) => soundName !== 'backgroundMusic')
            .map(([, sound]) => sound);
    }

    stopSoundEffects() {
        Object.entries(this.sounds)
            .filter(([soundName]) => soundName !== 'backgroundMusic')
            .forEach(([, sound]) => this.stopAudio(sound));
    }

    playSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !this.soundEffectsEnabled) return;
        sound.currentTime = 0;
        sound.play();
    }

    playLoopingSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !this.soundEffectsEnabled || !sound.paused) return;
        sound.loop = true;
        sound.play();
    }

    stopLoopingSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        sound.loop = false;
        this.stopAudio(sound);
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
