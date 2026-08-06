let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas")
    updateAudioButtons();
    audioManager.startBackgroundMusic();
    document.addEventListener('click', closeAudioMenuOnOutsideClick);
    showStartScreen();
}

function showStartScreen() {
    const startScreen = new Image();
    startScreen.onload = () => drawStartScreen(startScreen);
    startScreen.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
}

function drawStartScreen(startScreen) {
    const context = canvas.getContext('2d');
    context.drawImage(startScreen, 0, 0, canvas.width, canvas.height);
    document.getElementById('startGameControls').hidden = false;
}

function startGame() {
    if (world) return;
    hideGameControls();
    resetKeyboard();
    initLevel();
    audioManager.stopSoundEffects();
    audioManager.startBackgroundMusic();
    world = new World(canvas, keyboard);
}

function showEndScreenControls(gameWon) {
    const restartLabel = gameWon ? 'Nochmal spielen' : 'Erneut versuchen';
    document.getElementById('restartGameLabel').textContent = restartLabel;
    document.getElementById('endScreenControls').hidden = false;
}

function restartGame() {
    stopCurrentGame();
    startGame();
}

function showMainMenu() {
    stopCurrentGame();
    showStartScreen();
}

function stopCurrentGame() {
    if (world) world.stopGame();
    world = null;
    hideGameControls();
}

function hideGameControls() {
    document.getElementById('startGameControls').hidden = true;
    document.getElementById('endScreenControls').hidden = true;
}

function resetKeyboard() {
    keyboard = new Keyboard();
}

function toggleSoundEffects() {
    audioManager.toggleSoundEffects();
    updateSoundEffectsButton();
}

function toggleMusic() {
    audioManager.toggleMusic();
    updateMusicButton();
}

function toggleAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    if (menuDropdown.hidden) openAudioMenu();
    else closeAudioMenu();
}

function openAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    menuDropdown.classList.remove('audio-menu-closing');
    menuDropdown.hidden = false;
    document.getElementById('audioMenuButton').setAttribute('aria-expanded', true);
}

function openCredits() {
    openMenuOverlay('creditsOverlay');
}

function openControls() {
    openMenuOverlay('controlsOverlay');
}

function openMenuOverlay(overlayId) {
    closeAudioMenu();
    const switchInstantly = hasOpenMenuOverlay();
    hideOpenMenuOverlays();
    showMenuOverlay(overlayId, switchInstantly);
}

function hasOpenMenuOverlay() {
    return [...document.querySelectorAll('.menu-overlay')].some((overlay) => !overlay.hidden);
}

function showMenuOverlay(overlayId, switchInstantly) {
    const menuOverlay = document.getElementById(overlayId);
    menuOverlay.classList.toggle('instant-open', switchInstantly);
    menuOverlay.hidden = false;
}

function hideOpenMenuOverlays() {
    document.querySelectorAll('.menu-overlay').forEach((overlay) => {
        overlay.hidden = true;
        overlay.classList.remove('menu-closing');
    });
}

function closeAudioMenu() {
    const menuDropdown = document.getElementById('audioMenuDropdown');
    if (menuDropdown.hidden || menuDropdown.classList.contains('audio-menu-closing')) return;
    menuDropdown.classList.add('audio-menu-closing');
    menuDropdown.addEventListener('animationend', hideAudioMenu, { once: true });
    document.getElementById('audioMenuButton').setAttribute('aria-expanded', false);
}

function closeAudioMenuOnOutsideClick(event) {
    if (!event.target.closest('.audio-controls')) closeAudioMenu();
}

function hideAudioMenu(event) {
    event.currentTarget.hidden = true;
    event.currentTarget.classList.remove('audio-menu-closing');
}

function closeCredits() {
    closeMenuOverlay('creditsOverlay');
}

function closeControls() {
    closeMenuOverlay('controlsOverlay');
}

function closeMenuOverlay(overlayId) {
    const menuOverlay = document.getElementById(overlayId);
    menuOverlay.classList.remove('instant-open');
    menuOverlay.classList.add('menu-closing');
    menuOverlay.addEventListener('animationend', hideMenuOverlay, { once: true });
}

function hideMenuOverlay(event) {
    event.currentTarget.hidden = true;
    event.currentTarget.classList.remove('menu-closing');
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
function openImprint() {
    window.location.href = 'html/impressum.html';
}
