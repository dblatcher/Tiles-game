import { getDistanceBetween, areSamePlace, sortByDistanceFrom, unsafelyGetDistanceBetween } from "../utility"
import { orderTypesMap, OnGoingOrderType } from "../game-entities/OngoingOrder";
import { chooseMoveTowards, hasPathTo, sortByTotalMovemoveCostFor } from './pathfinding'
import { ComputerPersonality } from "./ComputerPersonality";
import { Unit } from "../game-entities/Unit";
import { MapSquare } from "../game-entities/MapSquare";
import { GameState } from '../game-entities/GameState'

import { debugLogAtLevel } from '../logging'
import { Town } from "../game-entities/Town";

interface CheckIfFinishedFunction {
    (
        unit: Unit,
        state: GameState,
    ): boolean
}

interface ChooseMoveFunction {
    (
        ai: ComputerPersonality,
        unit: Unit,
        state: GameState,
        possibleMoves: Array<MapSquare>,
        possibleActions: Array<OnGoingOrderType>,
    ): MapSquare | OnGoingOrderType
}

interface ChooseTargetFunction {
    (
        ai: ComputerPersonality,
        unit: Unit,
        state: GameState,
    ): { x: number, y: number }
}

class UnitMissionType {
    name: string;
    checkIfFinished: CheckIfFinishedFunction;
    chooseMove: ChooseMoveFunction;
    chooseTarget: ChooseTargetFunction;
    constructor(name: string, config: {
        checkIfFinished: CheckIfFinishedFunction,
        chooseMove: ChooseMoveFunction,
        chooseTarget?: ChooseTargetFunction,
    }) {
        this.name = name
        this.checkIfFinished = config.checkIfFinished || (() => false)
        this.chooseMove = config.chooseMove || (() => null)
        this.chooseTarget = config.chooseTarget || (() => null)
    }
}


// this is bound to UnitMission
const unitMissionTypes = {

    WAIT: new UnitMissionType('WAIT', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return false
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            return null
        }
    }),

    GO_TO: new UnitMissionType('GO_TO', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return unit.x == this.xTarget && unit.y == this.yTarget
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            const { target } = this
            return chooseMoveTowards(target, unit, state, possibleMoves)
        },
    }),

    RANDOM: new UnitMissionType('RANDOM', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return true
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        },
    }),

    CONQUER: new UnitMissionType('CONQUER', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            const { target } = this
            if (!target) { return true }
            const ai = unit.faction.computerPersonality as ComputerPersonality
            let enemyTowns = ai.getKnownEnemyTowns(state)
            return !enemyTowns.some(town => town.mapSquare.x === target.x && town.mapSquare.y === target.y)
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            if (!this.target) {
                this.target = unitMissionTypes[this.type].chooseTarget(ai, unit, state)
            }

            const { target } = this
            if (!target) { return null }
            const distance = getDistanceBetween(target, unit)
            debugLogAtLevel(3)(`*${unit.indexNumber}*${unit.description} at [${unit.x}, ${unit.y}] and wants to conquer the town at [${target.x}, ${target.y}] - ${distance} away`)

            const moveToAttack = possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
            return moveToAttack || chooseMoveTowards(target, unit, state, possibleMoves)
        },
        chooseTarget(ai: ComputerPersonality, unit: Unit, state: GameState) {
            let enemyTowns = ai.getKnownEnemyTowns(state)
                .sort(sortByTotalMovemoveCostFor(unit, state))
            return enemyTowns[0] || null
        },
    }),

    INTERCEPT: new UnitMissionType('INTERCEPT', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            const ai = unit.faction.computerPersonality as ComputerPersonality
            if (!this.cancelIfNoTargetFound) { return false }
            return this.range
                ? ai.getKnownEnemyUnitInOpen(state)
                    .filter(enemyUnit => unsafelyGetDistanceBetween(enemyUnit, unit) < this.range)
                    .length === 0
                : ai.getKnownEnemyUnitInOpen(state)
                    .length === 0
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            let knownEnemyUnitInOpen = ai.getKnownEnemyUnitInOpen(state)
                .sort(sortByTotalMovemoveCostFor(unit, state))

            if (this.range) {
                knownEnemyUnitInOpen = knownEnemyUnitInOpen
                    .filter(enemyUnit => unsafelyGetDistanceBetween(enemyUnit, unit) < this.range)
            }
            return chooseMoveTowards(knownEnemyUnitInOpen[0], unit, state, possibleMoves)
        }
    }),

    GO_TO_MY_NEAREST_TOWN: new UnitMissionType('GO_TO_MY_NEAREST_TOWN', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return state.towns.some(town => town.faction === unit.faction && areSamePlace(town, unit))
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {

            let myTowns = state.towns
                .filter(town => town.faction === unit.faction)
                .sort(sortByTotalMovemoveCostFor(unit, state))
            if (!myTowns[0]) { return null }

            return chooseMoveTowards(myTowns[0], unit, state, possibleMoves)
        }
    }),

    DEFEND_NEAREST_VULNERABLE_TOWN: new UnitMissionType('DEFEND_NEAREST_VULNERABLE_TOWN', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return false;
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: OnGoingOrderType[]) {
            const { target } = this
            if (!this.target) {
                this.target = unitMissionTypes[this.type].chooseTarget(ai, unit, state)
            }
            if (this.target === null) {
                return null
            }

            if (!areSamePlace(unit, target)) {
                return chooseMoveTowards(target, unit, state, possibleMoves)
            }

            if (possibleActions.includes(orderTypesMap['Fortify'])) {
                return orderTypesMap['Fortify']
            }
            return null
        },
        chooseTarget: function (ai: ComputerPersonality, unit: Unit, state: GameState) {

            const myTownsNeedingDefenders = state.towns
                .filter(town => town.faction === ai.faction)
                .filter(town => ai.wantsToAddDefender(town, state))
                .sort(sortByDistanceFrom(unit))

            let i, choosenTown = null as Town
            for (i = 0; i < myTownsNeedingDefenders.length; i++) {
                if (hasPathTo(myTownsNeedingDefenders[i], unit, state)) {
                    choosenTown = myTownsNeedingDefenders[i]
                    break;
                }
            }
            return choosenTown
        }
    }),

    DEFEND_TOWN_AT: new UnitMissionType('DEFEND_TOWN_AT', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            const { target } = this
            if (!target) {
                debugLogAtLevel(4)(`${unit.description} cancelling DEFEND_TOWN_AT - no target.`)
                return true
            }

            if (!state.towns.some(town => town.faction === unit.faction && areSamePlace(target, town))) {
                debugLogAtLevel(4)(`${unit.description} cancelling DEFEND_TOWN_AT - no town in target square.`)
                return true
            }

            return false
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            const { target } = this
            if (!target) { return null }
            if (!state.towns.some(town => town.faction === unit.faction && areSamePlace(target, town))) {
                return null
            }

            if (!areSamePlace(unit, target)) {
                return chooseMoveTowards(target, unit, state, possibleMoves)
            }

            if (possibleActions.includes(orderTypesMap['Fortify'])) {
                return orderTypesMap['Fortify']
            }
            return null
        }
    }),

    DEFEND_CURRENT_PLACE: new UnitMissionType('DEFEND_CURRENT_PLACE', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return false
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {
            if (possibleActions.includes(orderTypesMap['Fortify'])) {
                return orderTypesMap['Fortify']
            }
            return null
        }
    }),

    BUILD_NEW_TOWN: new UnitMissionType('BUILD_NEW_TOWN', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return false
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {

            if (!this.target) {
                this.target = unitMissionTypes[this.type].chooseTarget(ai, unit, state)
            }
            if (!this.target) { return null }

            if (areSamePlace(unit, this.target)) {
                if (possibleActions.includes(orderTypesMap['Build Town'])) {
                    return orderTypesMap['Build Town']
                }
            }

            return chooseMoveTowards(this.target, unit, state, possibleMoves)
        },
        chooseTarget(ai: ComputerPersonality, unit: Unit, state: GameState) {

            const possibleNewTownLocationsWithScores = ai.getPossibleNewTownLocations(state)
                .map(mapSquare => {
                    return { mapSquare, score: ai.assesNewTownLocation(mapSquare, ai.faction.worldMap).score }
                })
                .sort((itemA, itemB) => itemB.score - itemA.score)

            if (possibleNewTownLocationsWithScores.length === 0) {
                debugLogAtLevel(4)(`${unit.description} possible found no town locations.`)
                return null
            }
            const acceptableNewTownLocationsWithScores = possibleNewTownLocationsWithScores
                .filter(item => item.score >= ai.minimumTownLocationScore)

            if (acceptableNewTownLocationsWithScores.length === 0) {
                debugLogAtLevel(4)(`${unit.description} found no town location with a score of ${ai.minimumTownLocationScore} or more. Highest score was ${possibleNewTownLocationsWithScores[0].score}.`)
                return null
            }

            debugLogAtLevel(3)(
                `${unit.description} has choosen a place to build town, with score: ${acceptableNewTownLocationsWithScores[0].score}`,
                acceptableNewTownLocationsWithScores[0].mapSquare
            )
            return acceptableNewTownLocationsWithScores[0].mapSquare
        },
    }),

    EXPLORE: new UnitMissionType('EXPLORE', {
        checkIfFinished: function (unit: Unit, state: GameState) {
            return false
        },
        chooseMove: function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OnGoingOrderType>) {

            if (!this.target || areSamePlace(unit, this.target)) {
                this.target = unitMissionTypes[this.type].chooseTarget(ai, unit, state)
                debugLogAtLevel(3)(`Exploring ${unit.description} [${unit.x},${unit.y}] going to`, this.target)
            }

            if (!this.target) { return null }
            return chooseMoveTowards(this.target, unit, state, possibleMoves)
        },

        chooseTarget(ai: ComputerPersonality, unit: Unit, state: GameState) {

            const map = ai.faction.worldMap

            function hasSpaceNearby(mapSquare) {
                if (!mapSquare) { return false }
                const { x, y } = mapSquare
                const gridHeight = state.mapGrid.length
                const gridWidth = state.mapGrid[0].length

                if (y > 0 && !map[y - 1]) { return true }
                if (y + 1 < gridHeight && !map[y + 1]) { return true }

                if (x > 0 && !map[y][x - 1]) { return true }
                if (x + 1 < gridWidth && !map[y][x + 1]) { return true }

                if (y > 0 && !map[y - 1][x]) { return true }
                if (y + 1 < gridHeight && !map[y + 1][x]) { return true }

                if (y > 0 && x > 0 && !map[y - 1][x - 1]) { return true }
                if (y + 1 < gridHeight && x > 0 && !map[y + 1][x - 1]) { return true }
                if (y > 0 && x + 1 < gridWidth && !map[y - 1][x + 1]) { return true }
                if (y + 1 < gridHeight && x + 1 < gridWidth && !map[y + 1][x + 1]) { return true }
                return false
            }

            let placesWithSpacesNearby = map.flat()
                .filter(mapSquare => mapSquare !== null)
                .filter(mapSquare => hasSpaceNearby(mapSquare))
                .filter(mapSquare => unit.getCouldEnter(mapSquare))
                .sort(sortByDistanceFrom(unit))
            // sortByTotalMovemoveCostFor is too expensive for this misson

            return placesWithSpacesNearby[0] || null
        }
    })
}

export { unitMissionTypes, UnitMissionType }