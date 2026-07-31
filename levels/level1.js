const level1Endboss = new Endboss();
const level1Chickens = createChickens(5, level1Endboss.x);

const level1 = new Level(
    [
        ...level1Chickens,
        level1Endboss
    ],

    [
        new Cloud(),
        new Cloud()
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

        new BackgroundObject('img/5_background/layers/air.png', 1440),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1440),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1440),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1440),

        new BackgroundObject('img/5_background/layers/air.png', 2160),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 2160),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 2160),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2160)
    ],
);

function createChickens(amount, endbossX) {
    const chickens = [];
    const lastSpawnX = endbossX - 400;
    let nextX = 200 + Math.random() * 500;
    for (let i = 0; i < amount; i++) {
        chickens.push(new Chicken(nextX));
        const remainingGaps = amount - i - 1;
        if (remainingGaps > 0) nextX = getNextChickenX(nextX, i, amount, lastSpawnX);
    }
    return chickens;
}

function getNextChickenX(currentX, currentIndex, amount, lastSpawnX) {
    const minimumGap = getMinimumChickenGap(currentIndex);
    const reservedSpace = getReservedChickenSpace(currentIndex + 1, amount);
    const availableGap = lastSpawnX - currentX - reservedSpace;
    const maximumGap = Math.min(600, availableGap);
    return currentX + minimumGap + Math.random() * (maximumGap - minimumGap);
}

function getReservedChickenSpace(startIndex, amount) {
    let reservedSpace = 0;
    for (let i = startIndex; i < amount - 1; i++) {
        reservedSpace += getMinimumChickenGap(i);
    }
    return reservedSpace;
}

function getMinimumChickenGap(currentIndex) {
    return (currentIndex + 1) % 2 === 0 ? 400 : 150;
}
