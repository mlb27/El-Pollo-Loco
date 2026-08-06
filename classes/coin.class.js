class Coin extends DrawableObject {
    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 150;
    }
}