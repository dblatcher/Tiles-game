
function getTurnsToComplete(cost, increase) {
    if (cost <= 0) {
        return 1
    } else if (increase > 0) {
        return Math.ceil(cost / increase)
    } else {
        return Infinity
    }
}

function displayGain(number) {
    return ` (${number >= 0 ? '+' : ''}${number})`
}

function pluralise(word, number) {
    return number === 1 ? word : word + 's';
}

function camelToSentence(text) {
    var result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function findValueWithLowerCasedKey(targetObject, lowerCasedKey) {
    const keys = Object.keys(targetObject)
    const lowerCasedKeys = keys.map(key => key.toLowerCase())
    let index = lowerCasedKeys.indexOf(lowerCasedKey)
    if (index == -1) {return null}
    return targetObject[keys[index]]
}

export { getTurnsToComplete, displayGain, pluralise, camelToSentence, findValueWithLowerCasedKey }