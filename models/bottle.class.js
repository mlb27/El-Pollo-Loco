class Bottle extends DrawableObject {
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x) {
        super();
        const imageIndex = Math.floor(Math.random() * this.IMAGES_BOTTLE.length);
        this.loadImage(this.IMAGES_BOTTLE[imageIndex]);
        this.x = x;
        this.y = 370;
        this.width = 50;
        this.height = 60;
    }
}
