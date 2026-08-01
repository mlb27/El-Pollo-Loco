const level1Endboss = new Endboss();
const level1Chickens = createChickens(5, level1Endboss.x);
const level1Bottles = createBottles(15, level1Endboss.x);

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
    level1Bottles
);

function createChickens(amount, endbossX) {
    const chickens = [];
    const lastSpawnX = endbossX - 400;
    const minimumGaps = createChickenGaps(createChickenGroupSizes(amount));
    let nextX = 800 + Math.random() * 30;
    for (let i = 0; i < amount; i++) {
        chickens.push(new Chicken(nextX));
        if (i < amount - 1) {
            nextX = getNextChickenX(nextX, i, minimumGaps, lastSpawnX);
        }
    }
    return chickens;
}

function createChickenGroupSizes(amount) {
    const groupSizes = [];
    let remainingChickens = amount;
    while (remainingChickens > 0) {
        const groupSize = Math.min(1 + Math.floor(Math.random() * 3), remainingChickens);
        groupSizes.push(groupSize);
        remainingChickens -= groupSize;
    }
    return groupSizes;
}

function createChickenGaps(groupSizes) {
    const minimumGaps = [];
    groupSizes.forEach((groupSize, groupIndex) => {
        for (let i = 1; i < groupSize; i++) minimumGaps.push(150);
        if (groupIndex < groupSizes.length - 1) minimumGaps.push(230);
    });
    return minimumGaps;
}

function getNextChickenX(currentX, gapIndex, minimumGaps, lastSpawnX) {
    const minimumGap = minimumGaps[gapIndex];
    const reservedSpace = getReservedChickenSpace(minimumGaps, gapIndex + 1);
    const availableGap = lastSpawnX - currentX - reservedSpace;
    const gapLimit = minimumGap === 150 ? 250 : 600;
    const maximumGap = Math.min(gapLimit, availableGap);
    return currentX + minimumGap + Math.random() * (maximumGap - minimumGap);
}

function getReservedChickenSpace(minimumGaps, startIndex) {
    return minimumGaps.slice(startIndex).reduce((sum, gap) => sum + gap, 0);
}

function createBottles(amount, endbossX) {
    const bottles = [];
    const lastSpawnX = endbossX - 200;
    let nextX = 250 + Math.random() * 100;
    for (let i = 0; i < amount; i++) {
        bottles.push(new Bottle(nextX));
        const remainingBottles = amount - i - 1;
        if (remainingBottles > 0) {
            nextX = getNextBottleX(nextX, remainingBottles, lastSpawnX);
        }
    }
    return bottles;
}

function getNextBottleX(currentX, remainingBottles, lastSpawnX) {
    const minimumGap = 100;
    const reservedSpace = (remainingBottles - 1) * minimumGap;
    const availableGap = lastSpawnX - currentX - reservedSpace;
    const maximumGap = Math.min(180, availableGap);
    return currentX + minimumGap + Math.random() * (maximumGap - minimumGap);
}
