class LoadingScreen {
    IMAGE_PATHS = [
        'img/ui/loading/frame_00_delay-0.1s.png',
        'img/ui/loading/frame_01_delay-0.1s.png',
        'img/ui/loading/frame_02_delay-0.1s.png',
        'img/ui/loading/frame_03_delay-0.1s.png',
        'img/ui/loading/frame_04_delay-0.1s.png',
        'img/ui/loading/frame_05_delay-0.1s.png',
        'img/ui/loading/frame_06_delay-0.1s.png',
        'img/ui/loading/frame_07_delay-0.1s.png',
        'img/ui/loading/frame_08_delay-0.1s.png',
        'img/ui/loading/frame_09_delay-0.1s.png',
        'img/ui/loading/frame_10_delay-0.1s.png',
        'img/ui/loading/frame_11_delay-0.1s.png'
    ];
    currentImage = 0;

    /**
     * Loads and starts the animated loading screen.
     * @param {HTMLCanvasElement} canvas - Game canvas.
     */
    async start(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        await assetLoader.preloadImages(this.IMAGE_PATHS);
        this.drawFrame();
        this.animationInterval = setInterval(() => this.showNextFrame(), 100);
    }

    /** Draws the current loading frame centered on black. */
    drawFrame() {
        const image = assetLoader.getImage(this.IMAGE_PATHS[this.currentImage]);
        const x = (this.canvas.width - image.width) / 2;
        const y = (this.canvas.height - image.height) / 2;
        this.drawBackground();
        this.context.drawImage(image, x, y);
    }

    /** Advances and draws the next loading frame. */
    showNextFrame() {
        this.currentImage = (this.currentImage + 1) % this.IMAGE_PATHS.length;
        this.drawFrame();
    }

    /** Stops the loading animation and clears its final frame. */
    stop() {
        clearInterval(this.animationInterval);
        this.drawBackground();
    }

    /** Fills the complete canvas with black. */
    drawBackground() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const loadingScreen = new LoadingScreen();
