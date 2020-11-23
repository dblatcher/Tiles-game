import { MapSquare } from "../game-entities/MapSquare";
import { getDistanceBetween, areSamePlace } from "../utility"
import { onGoingOrderTypes, orderTypesMap } from "../game-entities/OngoingOrder.tsx";

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
    )
}

class UnitMission {
    type: string;
    xTarget: number | null;
    yTarget: number | null;
    range: number | null;
    untilCancelled: boolean;
    constructor(type: string, config: any = {}) {
        this.type = type
        this.xTarget = config.xTarget || null
        this.yTarget = config.yTarget || null
        this.range = config.range || null
        this.untilCancelled = !!config.untilCancelled
    }

    checkIfFinished(unit, state) {
        return unitMissionTypes[this.type].checkIfFinished.apply(this, [unit, state])
    }

    chooseMove(unit, state) {
        let possibleMoves = state.mapGrid
            .slice(unit.y - 1, unit.y + 2)
            .map(row => row.slice(unit.x - 1, unit.x + 2))
            .flat()
            .filter(mapSquare => unit.canMoveTo(mapSquare, state.mapGrid[unit.y][unit.x]))

        let possibleActions = unit.onGoingOrder
            ? []
            : onGoingOrderTypes
                .filter(orderType => orderType.canUnitUse(unit))
                .filter(orderType => orderType.checkIsValidForSquare(state.mapGrid[unit.y][unit.x]))

        const ai = unit.faction.computerPersonality
        return unitMissionTypes[this.type].chooseMove.apply(this, [ai, unit, state, possibleMoves, possibleActions])
    }

    set target(newTarget: any) {
        if (typeof newTarget !== 'object') {
            console.warn('invalid Mission target', newTarget)
        } else {

            if (newTarget.mapSquare) { newTarget = newTarget.mapSquare }

            if (typeof newTarget.x != 'number' || typeof newTarget.y != 'number') {
                console.warn('invalid Mission target', newTarget)
            } else {
                this.xTarget = newTarget.x
                this.yTarget = newTarget.y
            }
        }
    }

    get target() {
        if (typeof this.xTarget == 'number' && typeof this.yTarget == 'number') {
            return { x: this.xTarget, y: this.yTarget }
        }
        return null
    }

    get serialised() {
        let output = {}
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data) {
        return new UnitMission(data.type, {
            xTarget: data.xTarget,
            yTarget: data.yTarget,
        })
    }
}


export { UnitMission } 