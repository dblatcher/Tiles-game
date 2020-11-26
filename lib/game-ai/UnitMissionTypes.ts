import { getDistanceBetween, areSamePlace } from "../utility"
import { orderTypesMap } from "../game-entities/OngoingOrder.tsx";

class UnitMissionType {
    name: string;
    checkIfFinished: Function;
    chooseMove: Function;
    constructor(name, checkIfFinished, chooseMove) {
        this.name = name
        this.checkIfFinished = checkIfFinished
        this.chooseMove = chooseMove
    }
}


// TO DO - proper pathfinding function
function chooseMoveTowards(target, unit, state, possibleMoves) {
    if (!target) { return null }
    if (unit.x == target.x && unit.y == target.y) { return null }
    if (possibleMoves.length === 0) { return null }

    possibleMoves = possibleMoves.filter(mapSquare => {
        if (target.x >= unit.x && mapSquare.x < unit.x) { return false }
        if (target.x <= unit.x && mapSquare.x > unit.x) { return false }
        if (target.y >= unit.y && mapSquare.y < unit.y) { return false }
        if (target.y <= unit.y && mapSquare.y > unit.y) { return false }
        return true
    })

    possibleMoves.sort((mapSquareA, mapSquareB) => getDistanceBetween(mapSquareA, target) - getDistanceBetween(mapSquareB, target))
    return possibleMoves[0]
}

function sortByDistanceFrom(subject) {
    return (placeA, placeB) => getDistanceBetween(placeA, subject) - getDistanceBetween(placeB, subject)
}

// this is bound to UnitMission
const unitMissionTypes = {

    WAIT: new UnitMissionType('WAIT',
        function (unit, state) {
            return this.untilCancelled
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            return null
        }
    ),

    GO_TO: new UnitMissionType('GO_TO',
        function (unit, state) {
            return unit.x == this.xTarget && unit.y == this.yTarget
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            const { target } = this
            console.log(`*${unit.indexNumber}*${unit.description} at [${unit.x}, ${unit.y}] going to [${target.x}, ${target.y}]`)
            return chooseMoveTowards(target, unit, state, possibleMoves)
        },
    ),
    RANDOM: new UnitMissionType('RANDOM',
        function (unit, state) {
            return true
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            console.log(`*${unit.indexNumber}*${unit.description} at [${unit.x}, ${unit.y}] moving at random (${possibleMoves.length} options)`)
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        },
    ),
    CONQUER: new UnitMissionType('CONQUER',
        function (unit, state) {
            const { target } = this
            if (!target) { return true }
            const ai = unit.faction.computerPersonality
            let enemyTowns = ai.getKnownEnemyTowns(state)
            return !enemyTowns.some(town => town.mapSquare.x === target.x && town.mapSquare.y === target.y)
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            if (!this.target) {
                let enemyTowns = ai.getKnownEnemyTowns(state)
                    .sort((enemyTownA, enemyTownB) => getDistanceBetween(enemyTownA, unit) - getDistanceBetween(enemyTownB, unit))
                this.target = enemyTowns[0]
            }

            const { target } = this
            if (!target) { return null }
            const distance = getDistanceBetween(target, unit)
            console.log(`*${unit.indexNumber}*${unit.description} at [${unit.x}, ${unit.y}] and wants to conquer the town at [${target.x}, ${target.y}] - ${distance} away`)

            const moveToAttack = possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
            return moveToAttack || chooseMoveTowards(target, unit, state, possibleMoves)
        }
    ),
    INTERCEPT: new UnitMissionType('INTERCEPT',
        function (unit, state) {
            if (this.untilCancelled) { return false }
            const ai = unit.faction.computerPersonality
            return this.range
                ? ai.getKnownEnemyUnitInOpen(state)
                    .filter(enemyUnit => getDistanceBetween(enemyUnit, unit) < this.range)
                    .length === 0
                : ai.getKnownEnemyUnitInOpen(state)
                    .length === 0
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            let knownEnemyUnitInOpen = ai.getKnownEnemyUnitInOpen(state)
                .sort((enemyUnitA, enemyUnitB) => getDistanceBetween(enemyUnitA, unit) - getDistanceBetween(enemyUnitB, unit))

            return chooseMoveTowards(knownEnemyUnitInOpen[0], unit, state, possibleMoves)

        }
    ),
    GO_TO_MY_NEAREST_TOWN: new UnitMissionType('GO_TO_MY_NEAREST_TOWN',
        function (unit, state) {
            return state.towns.some(town => town.faction === unit.faction && areSamePlace(town,unit))
        },
        function (ai, unit, state, possibleMoves, possibleActions) {

            let myTowns = state.towns
                .filter(town => town.faction === unit.faction)
                .sort(sortByDistanceFrom(unit))

            if (!myTowns[0]) {return null}

            return chooseMoveTowards(myTowns[0], unit, state, possibleMoves)

        }
    ),
    DEFEND_CURRENT_PLACE: new UnitMissionType('DEFEND_CURRENT_PLACE',
        function (unit, state) {
            return false
        },
        function (ai, unit, state, possibleMoves, possibleActions) {
            if (possibleActions.includes(orderTypesMap['Fortify'])) {
                return orderTypesMap['Fortify']
            }
            return null
        }
    ),
    BUILD_NEW_TOWN: new UnitMissionType('BUILD_NEW_TOWN',
    function (unit, state) {
        return false
    },
    function (ai, unit, state, possibleMoves, possibleActions) {

        if (!this.target) {
            let possibleNewTownLocationsWithScores = ai.getPossibleNewTownLocations(state)
            .map(mapSquare => { 
                return {mapSquare, score: ai.assesNewTownLocation(mapSquare,ai.faction.worldMap).score }
            })
            .sort( (itemA, itemB) => itemB.score - itemA.score)

            if (possibleNewTownLocationsWithScores.length > 0) {
                this.target = possibleNewTownLocationsWithScores[0].mapSquare
                console.log(`${unit.description} has choosed a place to build town:`, this.target)
            } else {
                console.log(`${unit.description} has no a place to build town.`)
            }
        }

        if (!this.target) {return null}

        if (areSamePlace(unit, this.target)) {
            if (possibleActions.includes(orderTypesMap['Build Town'])) {
                return orderTypesMap['Build Town']
            }
        }

        return chooseMoveTowards(this.target, unit, state, possibleMoves)

    }
),
}

export {unitMissionTypes, UnitMissionType}