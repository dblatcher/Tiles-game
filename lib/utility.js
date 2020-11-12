
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

export { getTurnsToComplete, displayGain, pluralise, camelToSentence }