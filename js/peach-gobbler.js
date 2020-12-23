const db = firebase.firestore();

const values = {
    "fill_colors": ['red', 'green', 'blue'],
    "line_colors": ['red', 'green', 'blue'],
    "shape": ['triangle', 'rectangle', 'circle']
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
    let variable = randomElement(Object.entries(values));
    let randArray = shuffle([0, 1, 2]);
    let result = {};

    variable[1].forEach((key, i) => result[key] = randArray[i])
    return JSON.toString(result);
}

function generateLevels(num, low, high) {
    let levels = [];
    db.collection("PGLevels")
        .where("score", ">=", low)
        .where("score", "<=", high)
        .where("rule", "=", selectRule())
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                levels.push(doc.data())
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    let arr = [];
    while (arr.length < num) {
        let r = Math.floor(Math.random() * levels.length);
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    let map = arr.map(x => levels[x]);
    // sort result for preprocessing
    map = map.sort((a, b) => a.score - b.score);
    return map.map(x => x.geometry);
}