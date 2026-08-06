class Coin extends DrawableObject {
    /**
     * Creates a collectible coin at the given world position.
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 150;
    }
}