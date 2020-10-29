
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

export { getTurnsToComplete, displayGain, pluralise }