let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas")
    updateAudioButtons();
    audioManager.startBackgroundMusic();
    if (shouldRestartGame()) startGame();
    else showStartScreen();
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
    document.getElementById('startGameControls').hidden = true;
    document.getElementById('endScreenControls').hidden = true;
    world = new World(canvas, keyboard);
}

function shouldRestartGame() {
    const restartGame = sessionStorage.getItem('restartGame') === 'true';
    sessionStorage.removeItem('restartGame');
    return restartGame;
}

function showEndScreenControls(gameWon) {
    const restartLabel = gameWon ? 'Nochmal spielen' : 'Erneut versuchen';
    document.getElementById('restartGameLabel').textContent = restartLabel;
    document.getElementById('endScreenControls').hidden = false;
}

function restartGame() {
    sessionStorage.setItem('restartGame', 'true');
    window.location.reload();
}

function showMainMenu() {
    sessionStorage.removeItem('restartGame');
    window.location.reload();
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
    const menuButton = document.getElementById('audioMenuButton');
    const menuDropdown = document.getElementById('audioMenuDropdown');
    const menuOpen = menuDropdown.hidden;
    menuDropdown.hidden = !menuOpen;
    menuButton.setAttribute('aria-expanded', menuOpen);
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
    document.getElementById('audioMenuDropdown').hidden = true;
    document.getElementById('audioMenuButton').setAttribute('aria-expanded', false);
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
