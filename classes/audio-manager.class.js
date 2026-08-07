class AudioManager {
    soundEffectsEnabled = true;
    musicEnabled = true;
    gamePaused = false;
    pausedGameSounds = [];
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

    /** Creates the audio manager and restores saved sound settings. */
    constructor() {
        this.playBackgroundMusic = this.playBackgroundMusic.bind(this);
        this.loadSoundSettings();
        this.updateAudioState();
    }

    /** Loads music and sound-effect settings from local storage. */
    loadSoundSettings() {
        this.soundEffectsEnabled = this.getSoundSetting('soundEffectsEnabled');
        this.musicEnabled = this.getSoundSetting('musicEnabled');
    }

    /**
     * Reads a saved audio setting.
     * @param {string} settingName - Local-storage setting name.
     * @returns {boolean} Whether the selected audio group is enabled.
     */
    getSoundSetting(settingName) {
        const savedSetting = localStorage.getItem(settingName);
        if (savedSetting !== null) return savedSetting === 'true';
        return this.getLegacySoundSetting();
    }

    /**
     * Reads the legacy combined sound setting.
     * @returns {boolean} Whether legacy sound is enabled.
     */
    getLegacySoundSetting() {
        const savedSetting = localStorage.getItem('soundEnabled');
        return savedSetting === null || savedSetting === 'true';
    }

    /**
     * Persists an audio setting in local storage.
     * @param {string} settingName - Local-storage setting name.
     * @param {boolean} settingValue - Setting value to save.
     */
    saveSoundSetting(settingName, settingValue) {
        localStorage.setItem(settingName, settingValue);
    }

    /** Configures and starts the looping background music. */
    startBackgroundMusic() {
        const backgroundMusic = this.sounds.backgroundMusic;
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.2;
        this.resumeBackgroundMusic();
    }

    /** Pauses the background music. */
    pauseBackgroundMusic() {
        this.sounds.backgroundMusic.pause();
    }

    /** Resumes background music or waits for user interaction. */
    resumeBackgroundMusic() {
        const backgroundMusic = this.sounds.backgroundMusic;
        backgroundMusic.play().catch(() => this.waitForMusicInteraction());
    }

    /** Registers fallback listeners for browser audio permission. */
    waitForMusicInteraction() {
        document.addEventListener('pointerdown', this.playBackgroundMusic, { once: true });
        document.addEventListener('keydown', this.playBackgroundMusic, { once: true });
    }

    /** Plays background music after an allowed user interaction. */
    playBackgroundMusic() {
        this.sounds.backgroundMusic.play();
        document.removeEventListener('pointerdown', this.playBackgroundMusic);
        document.removeEventListener('keydown', this.playBackgroundMusic);
    }

    /** Toggles sound effects and saves the selected state. */
    toggleSoundEffects() {
        this.soundEffectsEnabled = !this.soundEffectsEnabled;
        this.saveSoundSetting('soundEffectsEnabled', this.soundEffectsEnabled);
        this.updateSoundEffectsState();
    }

    /** Toggles music and saves the selected state. */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveSoundSetting('musicEnabled', this.musicEnabled);
        this.updateMusicState();
    }

    /** Applies the current music and sound-effect settings. */
    updateAudioState() {
        this.updateSoundEffectsState();
        this.updateMusicState();
    }

    /** Applies the enabled state to every sound effect. */
    updateSoundEffectsState() {
        const soundEffects = this.getSoundEffects();
        soundEffects.forEach((sound) => sound.muted = !this.soundEffectsEnabled);
        if (!this.soundEffectsEnabled) this.stopSoundEffects();
    }

    /** Applies the enabled state to background music. */
    updateMusicState() {
        this.sounds.backgroundMusic.muted = !this.musicEnabled;
    }

    /**
     * Returns all audio elements except background music.
     * @returns {HTMLAudioElement[]} Available sound effects.
     */
    getSoundEffects() {
        return Object.entries(this.sounds)
            .filter(([soundName]) => soundName !== 'backgroundMusic')
            .map(([, sound]) => sound);
    }

    /** Stops and resets every active sound effect. */
    stopSoundEffects() {
        Object.entries(this.sounds)
            .filter(([soundName]) => soundName !== 'backgroundMusic')
            .forEach(([, sound]) => this.stopAudio(sound));
    }

    /** Pauses all currently playing game audio. */
    pauseGameAudio() {
        this.gamePaused = true;
        this.pausedGameSounds = Object.values(this.sounds).filter((sound) => !sound.paused);
        this.pausedGameSounds.forEach((sound) => sound.pause());
    }

    /** Resumes audio that was active before the game pause. */
    resumeGameAudio() {
        this.gamePaused = false;
        const pausedSounds = this.pausedGameSounds;
        this.pausedGameSounds = [];
        pausedSounds.forEach((sound) => this.resumeGameSound(sound));
    }

    /**
     * Resumes one previously active and still enabled sound.
     * @param {HTMLAudioElement} sound - Paused audio element.
     */
    resumeGameSound(sound) {
        const isMusic = sound === this.sounds.backgroundMusic;
        if (isMusic || this.soundEffectsEnabled) sound.play().catch(() => {});
    }

    /**
     * Plays a sound effect from its beginning.
     * @param {string} soundName - Registered sound-effect name.
     */
    playSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !this.soundEffectsEnabled || this.gamePaused) return;
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * Starts a registered sound effect in a loop.
     * @param {string} soundName - Registered sound-effect name.
     */
    playLoopingSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !this.soundEffectsEnabled || this.gamePaused || !sound.paused) return;
        sound.loop = true;
        sound.play();
    }

    /**
     * Stops a registered looping sound effect.
     * @param {string} soundName - Registered sound-effect name.
     */
    stopLoopingSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        sound.loop = false;
        this.stopAudio(sound);
    }

    /**
     * Stops a registered sound effect.
     * @param {string} soundName - Registered sound-effect name.
     */
    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) this.stopAudio(sound);
    }

    /**
     * Pauses and resets an audio element.
     * @param {HTMLAudioElement} sound - Audio element to stop.
     */
    stopAudio(sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

const audioManager = new AudioManager();
