let level1;

/** Creates all enemies, collectibles and scenery for level one. */
function initLevel() {
    const endboss = new Endboss();
    const chickens = createChickens(5, 10, endboss.x);
    const bottles = createBottles(15, endboss.x);
    const coins = createCoins(5, endboss.x);
    level1 = new Level(
        [...chickens, endboss], createClouds(), createBackgroundObjects(), bottles, coins
    );
}

/**
 * Creates the clouds displayed across level one.
 * @returns {Cloud[]} Level cloud objects.
 */
function createClouds() {
    return [new Cloud(), new Cloud(800), new Cloud(1600),
        new Cloud(2400), new Cloud(3200)];
}

/**
 * Creates all repeating background layers for level one.
 * @returns {BackgroundObject[]} Layered background objects.
 */
function createBackgroundObjects() {
    const positions = [-720, 0, 720, 1440, 2160, 2880, 3600];
    return positions.flatMap((x, index) => {
        const imageNumber = index % 2 === 0 ? 2 : 1;
        return createBackgroundLayer(x, imageNumber);
    });
}

/**
 * Creates one complete background layer group.
 * @param {number} x - Horizontal layer position.
 * @param {number} imageNumber - Alternating scenery image number.
 * @returns {BackgroundObject[]} One complete background group.
 */
function createBackgroundLayer(x, imageNumber) {
    return [
        new BackgroundObject('img/5_background/layers/air.png', x),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${imageNumber}.png`, x),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${imageNumber}.png`, x),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${imageNumber}.png`, x)
    ];
}
/**
 * Creates randomized normal and small chickens.
 * @param {number} normalAmount - Number of normal chickens.
 * @param {number} smallAmount - Number of small chickens.
 * @param {number} endbossX - Horizontal endboss position.
 * @returns {(Chicken|ChickenSmall)[]} Created chickens.
 */
function createChickens(normalAmount, smallAmount, endbossX) {
    const chickenTypes = createChickenTypes(normalAmount, smallAmount);
    const groupSizes = createChickenGroupSizes(chickenTypes.length);
    const positions = createChickenPositions(groupSizes, endbossX);
    return positions.map((x, index) => createChicken(chickenTypes[index], x));
}

/**
 * Creates and shuffles the requested chicken types.
 * @param {number} normalAmount - Number of normal chickens.
 * @param {number} smallAmount - Number of small chickens.
 * @returns {string[]} Shuffled chicken type names.
 */
function createChickenTypes(normalAmount, smallAmount) {
    const chickenTypes = [];
    for (let i = 0; i < normalAmount; i++) chickenTypes.push('normal');
    for (let i = 0; i < smallAmount; i++) chickenTypes.push('small');
    return shuffleChickenItems(chickenTypes);
}

/**
 * Shuffles an array in place.
 * @param {Array} items - Items to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleChickenItems(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentItem = items[index];
        items[index] = items[randomIndex];
        items[randomIndex] = currentItem;
    }
    return items;
}

/**
 * Creates one chicken of the selected type.
 * @param {string} type - Chicken type name.
 * @param {number} x - Horizontal world position.
 * @returns {Chicken|ChickenSmall} Created chicken.
 */
function createChicken(type, x) {
    if (type === 'normal') return new Chicken(x);
    return new ChickenSmall(x);
}

/**
 * Creates grouped chicken positions across the level.
 * @param {number[]} groupSizes - Amount of chickens in each group.
 * @param {number} endbossX - Horizontal endboss position.
 * @returns {number[]} Horizontal chicken positions.
 */
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

/**
 * Creates randomized chicken group sizes.
 * @param {number} amount - Total number of chickens.
 * @returns {number[]} Shuffled group sizes.
 */
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

/**
 * Creates small within-group and large between-group gaps.
 * @param {number[]} groupSizes - Amount of chickens in each group.
 * @returns {number[]} Minimum distances between chickens.
 */
function createChickenGaps(groupSizes) {
    const minimumGaps = [];
    groupSizes.forEach((groupSize, groupIndex) => {
        for (let i = 1; i < groupSize; i++) minimumGaps.push(70);
        if (groupIndex < groupSizes.length - 1) minimumGaps.push(300);
    });
    return minimumGaps;
}

/**
 * Calculates the next randomized chicken position.
 * @param {number} currentX - Previous chicken position.
 * @param {number} gapIndex - Current gap index.
 * @param {number[]} minimumGaps - Required remaining gaps.
 * @param {number} lastSpawnX - Latest allowed spawn position.
 * @returns {number} Next horizontal chicken position.
 */
function getNextChickenX(currentX, gapIndex, minimumGaps, lastSpawnX) {
    const minimumGap = minimumGaps[gapIndex];
    const reservedSpace = getReservedChickenSpace(minimumGaps, gapIndex + 1);
    const availableGap = lastSpawnX - currentX - reservedSpace;
    const gapLimit = minimumGap === 70 ? 110 : 500;
    const maximumGap = Math.min(gapLimit, availableGap);
    return currentX + minimumGap + Math.random() * (maximumGap - minimumGap);
}

/**
 * Calculates space reserved for remaining chicken gaps.
 * @param {number[]} minimumGaps - All required gaps.
 * @param {number} startIndex - First remaining gap index.
 * @returns {number} Reserved horizontal space.
 */
function getReservedChickenSpace(minimumGaps, startIndex) {
    return minimumGaps.slice(startIndex).reduce((sum, gap) => sum + gap, 0);
}


/**
 * Distributes collectible bottles before the endboss area.
 * @param {number} amount - Number of bottles to create.
 * @param {number} endbossX - Horizontal endboss position.
 * @returns {Bottle[]} Created collectible bottles.
 */
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
/**
 * Distributes collectible coins before the endboss area.
 * @param {number} amount - Number of coins to create.
 * @param {number} endbossX - Horizontal endboss position.
 * @returns {Coin[]} Created collectible coins.
 */
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