
function getTurnsToComplete(cost, increase) {
    if (cost <= 0) {
        return 1
    } else if (increase > 0) {
        return Math.ceil(cost / increase)
    } else {
        return Infinity
    }
}

function pickAtRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function displayGain(number) {
    return ` (${number >= 0 ? '+' : ''}${number})`
}

function displayTurnsToComplete(number) {
    if (!isFinite(number)) { return 'never' }
    return `${number} ${pluralise('turn', number)}`
}

function pluralise(word, number) {
    return number === 1 ? word : word + 's';
}

function camelToSentence(text) {
    var result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function findValueWithLowerCasedKey(targetObject, lowerCasedKey) {
    const keys = Object.keys(targetObject)
    const lowerCasedKeys = keys.map(key => key.toLowerCase())
    let index = lowerCasedKeys.indexOf(lowerCasedKey)
    if (index == -1) { return null }
    return targetObject[keys[index]]
}

function formatListOfProperties(array, properyName) {
    return array.reduce((output, item, index, array) => {
        let conjunction = index === 0
            ? ""
            : index + 1 < array.length
                ? ", "
                : " and ";
        return output + conjunction + item[properyName].toString()
    }, "")
}

function getDistanceBetween(placeA, placeB, mapWidth = Infinity) {
    if (placeA === null || placeB === null) { return Infinity }
    if (typeof placeA === 'object' && placeA.mapSquare) { placeA = placeA.mapSquare }
    if (typeof placeA !== 'object' || typeof placeA.x !== 'number' || typeof placeA.y !== 'number') { return Infinity }

    if (typeof placeB === 'object' && placeB.mapSquare) { placeB = placeB.mapSquare }
    if (typeof placeB !== 'object' || typeof placeB.x !== 'number' || typeof placeB.y !== 'number') { return Infinity }

    return unsafelyGetDistanceBetween(placeA, placeB, mapWidth)
}

// use only when place values definately have x and y values
function unsafelyGetDistanceBetween(placeA, placeB, mapWidth = Infinity) {
    let xDiff = Math.abs(placeA.x - placeB.x)
    let wrappingXDiff = Math.abs(xDiff - mapWidth)

    // because a diagonal step is treated as the same distance as vertical or horizontal step
    // pythagoras does not apply - the total distance in steps is equal to the greatest distance
    // in either direction
    return Math.max(
        Math.min(xDiff, wrappingXDiff),
        Math.abs(placeA.y - placeB.y)
    )
}

function areSamePlace(placeA, placeB) {
    return getDistanceBetween(placeA, placeB) === 0
}

function unsafelyCheckAreSamePlace(placeA, placeB) {
    return placeA.x == placeB.x && placeA.y == placeB.y
}

function sortByDistanceFrom(subject) {
    return (placeA, placeB) => getDistanceBetween(placeA, subject) - getDistanceBetween(placeB, subject)
}

function getAreaSurrounding(place, mapGrid) {
    const { x, y } = place
    let surroundingArea = []
    surroundingArea.push(mapGrid[y - 1] || [])
    surroundingArea.push(mapGrid[y] || [])
    surroundingArea.push(mapGrid[y + 1] || [])
    return surroundingArea
        .flat()
        .filter(mapSquare => mapSquare !== null)
        .filter(mapSquare => Math.abs(mapSquare.x - x) <= 1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function asyncSetState(component, action) {
    return new Promise(resolve => {
        component.setState(action, resolve)
    })
}

const randomInt = (range, min = 0) => Math.max(Math.floor(Math.random() * range), min);

function removePossibleMembers(array, items) {

    items.forEach(item => {
        let index;
        while (index !== -1) {
            index = array.indexOf(item)
            if (index !== -1) { array.splice(index, 1) }
        }
    })

}

export {
    getTurnsToComplete, displayGain, displayTurnsToComplete,
    pluralise, camelToSentence, findValueWithLowerCasedKey, formatListOfProperties,
    getDistanceBetween, unsafelyGetDistanceBetween, areSamePlace, unsafelyCheckAreSamePlace, sortByDistanceFrom,
    getAreaSurrounding,
    sleep, asyncSetState,
    randomInt, pickAtRandom,
    removePossibleMembers,
}