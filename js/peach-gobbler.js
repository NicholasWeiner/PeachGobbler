const db = firebase.firestore();

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

function generateLevels(num, low, high) {
    let levels = [];
    db.collection("PGLevels").where("score", ">=", low).where("score", "<=", high)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            levels.push(doc.data())
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    let arr = [];
    while(arr.length < num){
        let r = Math.floor(Math.random() * levels.length);
        if(arr.indexOf(r) === -1) arr.push(r);
    }

    let map = arr.map(x => levels[x]);
    // sort result for preprocessing
    map = map.sort((a, b) => a.score - b.score);
    return map.map(x => x.geometry);
}