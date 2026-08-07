class CoinBar extends DrawableObject {
    IMAGES_COIN_BAR = [
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/game/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    percentage = 0;

    /** Creates the coin status bar with its initial state. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN_BAR);
        this.x = 10;
        this.y = 55;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }

    /**
     * Updates the coin status bar image.
     * @param {number} percentage - Current percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES_COIN_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index for the current coin percentage.
     * @returns {number} Index of the matching status bar image.
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}