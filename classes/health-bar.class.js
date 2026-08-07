class HealthBar extends DrawableObject {
    IMAGES_HEALTH_BAR = [
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/game/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ]

    percentage = 100;

    /** Creates the health status bar with its initial state. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH_BAR);
        this.x = 10;
        this.y = -5;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the health status bar image.
     * @param {number} percentage - Current percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES_HEALTH_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index for the current health percentage.
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
