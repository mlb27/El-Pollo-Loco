let canvas;
let world;
let keyboard = new Keyboard();

/** Initializes canvas, audio controls and the start screen. */
async function init() {
    canvas = document.getElementById("canvas")
    await loadingScreen.start(canvas);
    updateAudioButtons();
    initializeMobileControls();
    initializeOrientationPause();
    updateMobileGameScale();
    await assetLoader.preloadImages();
    loadingScreen.stop();
    audioManager.startBackgroundMusic();
    document.addEventListener('click', closeAudioMenuOnOutsideClick);
    window.addEventListener('resize', updateMobileGameScale);
    showStartScreen();
}


/** Loads and displays the game start screen. */
function showStartScreen() {
    const path = 'img/game/9_intro_outro_screens/start/startscreen_1.png';
    drawStartScreen(assetLoader.getImage(path));
}

/**
 * Draws the loaded start screen and reveals its controls.
 * @param {HTMLImageElement} startScreen - Loaded start-screen image.
 */
function drawStartScreen(startScreen) {
    const context = canvas.getContext('2d');
    context.drawImage(startScreen, 0, 0, canvas.width, canvas.height);
    document.getElementById('startGameControls').hidden = false;
}

/** Creates and starts a fresh game world. */
function startGame() {
    if (world) return;
    hideGameControls();
    resetKeyboard();
    showMobileControls();
    initLevel();
    audioManager.stopSoundEffects();
    audioManager.startBackgroundMusic();
    world = new World(canvas, keyboard);
    pauseButton.show(world);
}

/**
 * Displays controls matching the final game result.
 * @param {boolean} gameWon - Whether the player won the game.
 */
function showEndScreenControls(gameWon) {
    const restartLabel = gameWon ? 'Nochmal spielen' : 'Erneut versuchen';
    hideMobileControls();
    pauseButton.hide();
    document.getElementById('restartGameLabel').textContent = restartLabel;
    document.getElementById('endScreenControls').hidden = false;
}

/** Stops the current world and starts a fresh level. */
function restartGame() {
    stopCurrentGame();
    startGame();
}

/** Stops the current world and returns to the start screen. */
function showMainMenu() {
    stopCurrentGame();
    showStartScreen();
}

/** Stops and clears the active game world. */
function stopCurrentGame() {
    if (world) world.stopGame();
    world = null;
    hideGameControls();
}

/** Hides start and end-screen game controls. */
function hideGameControls() {
    document.getElementById('startGameControls').hidden = true;
    document.getElementById('endScreenControls').hidden = true;
    hideMobileControls();
    pauseButton.hide();
}

/** Replaces the keyboard state with a fresh instance. */
function resetKeyboard() {
    keyboard = new Keyboard();
}
/** Connects every mobile button to the existing keyboard state. */
function initializeMobileControls() {
    document.querySelectorAll('.mobile-control-button').forEach(addMobileControlListeners);
}

/**
 * Adds pointer listeners to one mobile control.
 * @param {HTMLButtonElement} button - Mobile control button.
 */
function addMobileControlListeners(button) {
    button.addEventListener('pointerdown', (event) => updateMobileControl(event, true));
    button.addEventListener('pointerup', (event) => updateMobileControl(event, false));
    button.addEventListener('pointercancel', (event) => updateMobileControl(event, false));
    button.addEventListener('pointerleave', (event) => updateMobileControl(event, false));
    button.addEventListener('contextmenu', preventMobileContextMenu);
}

/**
 * Updates a mobile control and prevents browser touch gestures.
 * @param {PointerEvent} event - Pointer event from a control button.
 * @param {boolean} isPressed - Whether the control is pressed.
 */
function updateMobileControl(event, isPressed) {
    event.preventDefault();
    keyboard[event.currentTarget.dataset.key] = isPressed;
    if (isPressed) event.currentTarget.setPointerCapture(event.pointerId);
}

/**
 * Prevents the long-press context menu on mobile controls.
 * @param {Event} event - Context-menu event from a mobile control.
 */
function preventMobileContextMenu(event) {
    event.preventDefault();
}

/** Shows touch controls while a game is running. */
function showMobileControls() {
    document.getElementById('mobileControls').hidden = false;
}

/** Hides touch controls outside an active game. */
function hideMobileControls() {
    document.getElementById('mobileControls').hidden = true;
}

/** Scales the complete game design to a mobile landscape viewport. */
function updateMobileGameScale() {
    const gameContainer = document.getElementById('gameContainer');
    const isMobileLandscape = innerWidth <= 1024 && innerWidth > innerHeight;
    const scale = isMobileLandscape ? calculateMobileScale() : 1;
    gameContainer.style.setProperty('--game-scale', scale);
}

/**
 * Calculates a scale that includes the canvas frame and upper menus.
 * @returns {number} Mobile game scale.
 */
function calculateMobileScale() {
    return Math.min(innerWidth / 860, innerHeight / 660, 1);
}

/** Registers game pause handling for mobile portrait orientation. */
function initializeOrientationPause() {
    const portraitQuery = matchMedia('(max-width: 1024px) and (orientation: portrait)');
    portraitQuery.addEventListener('change', handleOrientationChange);
}

/**
 * Pauses or resumes the active world after an orientation change.
 * @param {MediaQueryListEvent} event - Changed portrait-media-query state.
 */
function handleOrientationChange(event) {
    if (!world) return;
    if (event.matches) world.pauseGame('orientation');
    else world.resumeGame('orientation');
    pauseButton.update(world);
}

/** Toggles the manual game pause from its menu button. */
function toggleGamePause() {
    if (world) pauseButton.toggle(world);
}

/** Toggles sound effects and updates their menu button. */
function toggleSoundEffects() {
    audioManager.toggleSoundEffects();
    updateSoundEffectsButton();
}

/** Toggles background music and updates its menu button. */
function toggleMusic() {
    audioManager.toggleMusic();
    updateMusicButton();
}

/** Opens or closes the audio settings dropdown. */
function toggleAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    if (menuDropdown.hidden) openAudioMenu();
    else closeAudioMenu();
}

/** Opens the audio settings dropdown. */
function openAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    menuDropdown.classList.remove('audio-menu-closing');
    menuDropdown.hidden = false;
    document.getElementById('audioMenuButton').setAttribute('aria-expanded', true);
}

/** Opens the credits overlay. */
function openCredits() {
    openMenuOverlay('creditsOverlay');
}

/** Opens the controls overlay. */
function openControls() {
    openMenuOverlay('controlsOverlay');
}

/**
 * Opens one menu overlay and closes any currently open overlay.
 * @param {string} overlayId - ID of the overlay to open.
 */
function openMenuOverlay(overlayId) {
    closeAudioMenu();
    const switchInstantly = hasOpenMenuOverlay();
    hideOpenMenuOverlays();
    showMenuOverlay(overlayId, switchInstantly);
}

/**
 * Checks whether any menu overlay is currently open.
 * @returns {boolean} Whether an overlay is visible.
 */
function hasOpenMenuOverlay() {
    return [...document.querySelectorAll('.menu-overlay')].some((overlay) => !overlay.hidden);
}

/**
 * Displays a selected menu overlay.
 * @param {string} overlayId - ID of the overlay to display.
 * @param {boolean} switchInstantly - Whether to skip the opening fade.
 */
function showMenuOverlay(overlayId, switchInstantly) {
    const menuOverlay = document.getElementById(overlayId);
    menuOverlay.classList.toggle('instant-open', switchInstantly);
    menuOverlay.hidden = false;
}

/** Immediately hides every open menu overlay. */
function hideOpenMenuOverlays() {
    document.querySelectorAll('.menu-overlay').forEach((overlay) => {
        overlay.hidden = true;
        overlay.classList.remove('menu-closing');
    });
}

/** Closes the audio dropdown with its fade animation. */
function closeAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    if (menuDropdown.hidden || menuDropdown.classList.contains('audio-menu-closing')) return;
    menuDropdown.classList.add('audio-menu-closing');
    menuDropdown.addEventListener('animationend', hideAudioMenu, { once: true });
    document.getElementById('audioMenuButton').setAttribute('aria-expanded', false);
}

/**
 * Closes the audio dropdown after an outside click.
 * @param {MouseEvent} event - Browser click event.
 */
function closeAudioMenuOnOutsideClick(event) {
    if (!event.target.closest('.audio-controls')) closeAudioMenu();
}

/**
 * Hides the audio dropdown after its closing animation.
 * @param {AnimationEvent} event - Completed animation event.
 */
function hideAudioMenu(event) {
    event.currentTarget.hidden = true;
    event.currentTarget.classList.remove('audio-menu-closing');
}

/** Closes the credits overlay. */
function closeCredits() {
    closeMenuOverlay('creditsOverlay');
}

/** Closes the controls overlay. */
function closeControls() {
    closeMenuOverlay('controlsOverlay');
}

/**
 * Starts the closing animation of a menu overlay.
 * @param {string} overlayId - ID of the overlay to close.
 */
function closeMenuOverlay(overlayId) {
    const menuOverlay = document.getElementById(overlayId);
    menuOverlay.classList.remove('instant-open');
    menuOverlay.classList.add('menu-closing');
    menuOverlay.addEventListener('animationend', hideMenuOverlay, { once: true });
}

/**
 * Hides an overlay after its closing animation.
 * @param {AnimationEvent} event - Completed animation event.
 */
function hideMenuOverlay(event) {
    event.currentTarget.hidden = true;
    event.currentTarget.classList.remove('menu-closing');
}

/** Updates both audio menu buttons. */
function updateAudioButtons() {
    updateSoundEffectsButton();
    updateMusicButton();
}

/** Updates the sound-effects button state and label. */
function updateSoundEffectsButton() {
    updateAudioButton('soundEffectsButton', audioManager.soundEffectsEnabled, 'Soundeffekte');
}

/** Updates the music button state and label. */
function updateMusicButton() {
    updateAudioButton('musicButton', audioManager.musicEnabled, 'Soundtrack');
}

/**
 * Updates one audio button and its accessibility attributes.
 * @param {string} buttonId - ID of the audio button.
 * @param {boolean} enabled - Current enabled state.
 * @param {string} label - Human-readable audio group label.
 */
function updateAudioButton(buttonId, enabled, label) {
    const button = document.getElementById(buttonId);
    const soundAction = enabled ? 'ausschalten' : 'einschalten';
    button.classList.toggle('is-enabled', enabled);
    button.setAttribute('aria-label', `${label} ${soundAction}`);
    button.setAttribute('aria-pressed', enabled);
    button.title = `${label} ${soundAction}`;
}

const keyBindings = {
    32: 'SPACE',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    68: 'D'
};

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

/**
 * Activates the keyboard state assigned to a pressed key.
 * @param {KeyboardEvent} event - Browser keyboard event.
 */
function handleKeyDown(event) {
    updateKeyboardState(event.keyCode, true);
}

/**
 * Deactivates the keyboard state assigned to a released key.
 * @param {KeyboardEvent} event - Browser keyboard event.
 */
function handleKeyUp(event) {
    updateKeyboardState(event.keyCode, false);
}

/**
 * Updates one mapped keyboard control.
 * @param {number} keyCode - Legacy numeric keyboard code.
 * @param {boolean} isPressed - Whether the key is currently pressed.
 */
function updateKeyboardState(keyCode, isPressed) {
    const key = keyBindings[keyCode];
    if (key) keyboard[key] = isPressed;
}
/** Navigates to the local imprint page. */
function openImprint() {
    window.location.href = 'html/impressum.html';
}
