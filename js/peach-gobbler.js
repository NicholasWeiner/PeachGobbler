'use strict';
const db = firebase.firestore();

const values = {
    fillColors: ['red', 'green', 'blue'],
    lineColors: ['red', 'green', 'blue'],
    shape: ['triangle', 'rectangle', 'circle']
};

// adjust these constants to change cutoffs
const EASYCUTOFF = 7;
const MEDIUMCUTOFF = 100;
const HARDCUTOFF = 72000;

function makeLevelSuite() {
    return makeEasyLevels() + makeMediumLevels() + makeHardLevels();
}

function makeEasyLevels() {
    return generateLevels(3, 0, EASYCUTOFF);
}

function makeMediumLevels() {
    return generateLevels(3, EASYCUTOFF, MEDIUMCUTOFF);
}

function makeHardLevels() {
    return generateLevels(4, MEDIUMCUTOFF, HARDCUTOFF);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function selectRule() {
    const variable = randomElement(Object.entries(values));
    const randArray = shuffle([0, 1, 2]);
    let result = {};

    variable[1].forEach((key, i) => result[key] = randArray[i])
    return JSON.toString(result);
}

function generateLevels(num, low, high) {
    let levels = [];
    db.collection('PGLevels')
        .where('score', '>=', low)
        .where('score', '<=', high)
        .where('rule', '=', selectRule())
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                levels.push(doc.data())
            });
        })
        .catch(function (error) {
            console.log('Error getting documents: ', error);
        });

    let arr = [];
    while (arr.length < num) {
        const randIndex = Math.floor(Math.random() * levels.length);
        if (arr.indexOf(randIndex) === -1) arr.push(randIndex);
    }

    const map = arr.map(index => levels[index]);
    // sort result for preprocessing
    const sortedMap = map.sort((a, b) => a.score - b.score);
    return sortedMap.map(level => level.geometry);
}
