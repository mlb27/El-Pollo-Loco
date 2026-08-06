class EndbossBar extends DrawableObject {
    IMAGES_ENDBOSS_BAR = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    percentage = 100;

    /** Creates the endboss status bar with its initial state. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_BAR);
        this.x = 10;
        this.y = 175;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the endboss status bar image.
     * @param {number} percentage - Current percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES_ENDBOSS_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index for the current endboss percentage.
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
