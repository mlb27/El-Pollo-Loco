let level1;

function initLevel() {
    const level1Endboss = new Endboss();
    const level1Chickens = createChickens(5, 10, level1Endboss.x);
    const level1Bottles = createBottles(15, level1Endboss.x);
    const level1Coins = createCoins(5, level1Endboss.x);

    level1 = new Level(
    [
        ...level1Chickens,
        level1Endboss
    ],

    [
        new Cloud(),
        new Cloud(800),
        new Cloud(1600),
        new Cloud(2400),
        new Cloud(3200)
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
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2160),

        new BackgroundObject('img/5_background/layers/air.png', 2880),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 2880),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 2880),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 2880),

        new BackgroundObject('img/5_background/layers/air.png', 3600),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 3600),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 3600),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 3600)
    ],
    level1Bottles,
    level1Coins
    );
}

function createChickens(normalAmount, smallAmount, endbossX) {
    const chickenTypes = createChickenTypes(normalAmount, smallAmount);
    const groupSizes = createChickenGroupSizes(chickenTypes.length);
    const positions = createChickenPositions(groupSizes, endbossX);
    return positions.map((x, index) => createChicken(chickenTypes[index], x));
}

function createChickenTypes(normalAmount, smallAmount) {
    const chickenTypes = [];
    for (let i = 0; i < normalAmount; i++) chickenTypes.push('normal');
    for (let i = 0; i < smallAmount; i++) chickenTypes.push('small');
    return shuffleChickenItems(chickenTypes);
}

function shuffleChickenItems(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentItem = items[index];
        items[index] = items[randomIndex];
        items[randomIndex] = currentItem;
    }
    return items;
}

function createChicken(type, x) {
    if (type === 'normal') return new Chicken(x);
    return new ChickenSmall(x);
}

function createChickenPositions(groupSizes, endbossX) {
    const positions = [];
    const minimumGaps = createChickenGaps(groupSizes);
    const amount = groupSizes.reduce((sum, size) => sum + size, 0);
    const lastSpawnX = endbossX - 400;
    let nextX = 550 + Math.random() * 50;
    for (let i = 0; i < amount; i++) {
        positions.push(nextX);
        if (i < amount - 1) nextX = getNextChickenX(nextX, i, minimumGaps, lastSpawnX);
    }
    return positions;
}

function createChickenGroupSizes(amount) {
    const groupSizes = [1, 2];
    let remainingChickens = amount - 3;
    while (remainingChickens > 0) {
        const groupSize = Math.min(3, remainingChickens);
        groupSizes.push(groupSize);
        remainingChickens -= groupSize;
    }
    return shuffleChickenItems(groupSizes);
}

function createChickenGaps(groupSizes) {
    const minimumGaps = [];
    groupSizes.forEach((groupSize, groupIndex) => {
        for (let i = 1; i < groupSize; i++) minimumGaps.push(70);
        if (groupIndex < groupSizes.length - 1) minimumGaps.push(300);
    });
    return minimumGaps;
}

function getNextChickenX(currentX, gapIndex, minimumGaps, lastSpawnX) {
    const minimumGap = minimumGaps[gapIndex];
    const reservedSpace = getReservedChickenSpace(minimumGaps, gapIndex + 1);
    const availableGap = lastSpawnX - currentX - reservedSpace;
    const gapLimit = minimumGap === 70 ? 110 : 500;
    const maximumGap = Math.min(gapLimit, availableGap);
    return currentX + minimumGap + Math.random() * (maximumGap - minimumGap);
}

function getReservedChickenSpace(minimumGaps, startIndex) {
    return minimumGaps.slice(startIndex).reduce((sum, gap) => sum + gap, 0);
}


function createBottles(amount, endbossX) {
    const bottles = [];
    const firstBottleX = 250 + Math.random() * 100;
    const lastBottleX = endbossX - 600 - Math.random() * 100;
    for (let i = 0; i < amount; i++) {
        const progress = i / (amount - 1);
        const randomOffset = i === 0 || i === amount - 1 ? 0 : (Math.random() - 0.5) * 60;
        const bottleX = firstBottleX + (lastBottleX - firstBottleX) * progress + randomOffset;
        bottles.push(new Bottle(bottleX));
    }
    return bottles;
}
function createCoins(amount, endbossX) {
    const coins = [];
    const firstCoinX = 400 + Math.random() * 100;
    const lastCoinX = endbossX - 500 - Math.random() * 100;
    for (let i = 0; i < amount; i++) {
        const progress = i / (amount - 1);
        const randomOffset = i === 0 || i === amount - 1 ? 0 : (Math.random() - 0.5) * 200;
        const coinX = firstCoinX + (lastCoinX - firstCoinX) * progress + randomOffset;
        const coinY = 120 + Math.random() * 180;
        coins.push(new Coin(coinX, coinY));
    }
    return coins;
}