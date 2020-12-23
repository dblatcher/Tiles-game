import { getDistanceBetween, areSamePlace, sortByDistanceFrom, unsafelyGetDistanceBetween } from "../utility"
import { orderTypesMap, OngoingOrderType } from "../game-entities/OngoingOrder.tsx";
import { chooseMoveTowards } from './pathfinding.ts'
import { ComputerPersonality } from "./ComputerPersonality";
import { Unit } from "../game-entities/Unit";
import { MapSquare } from "../game-entities/MapSquare";
import { GameState } from '../game-entities/GameState'

import { debugLogAtLevel } from '../logging'

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


// this is bound to UnitMission
const unitMissionTypes = {

    WAIT: new UnitMissionType('WAIT',
        function (unit: Unit, state: GameState) {
            return this.untilCancelled
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            return null
        }
    ),

    GO_TO: new UnitMissionType('GO_TO',
        function (unit: Unit, state: GameState) {
            return unit.x == this.xTarget && unit.y == this.yTarget
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            const { target } = this
            return chooseMoveTowards(target, unit, state, possibleMoves)
        },
    ),
    RANDOM: new UnitMissionType('RANDOM',
        function (unit: Unit, state: GameState) {
            return true
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        },
    ),
    CONQUER: new UnitMissionType('CONQUER',
        function (unit: Unit, state: GameState) {
            const { target } = this
            if (!target) { return true }
            const ai = unit.faction.computerPersonality
            let enemyTowns = ai.getKnownEnemyTowns(state)
            return !enemyTowns.some(town => town.mapSquare.x === target.x && town.mapSquare.y === target.y)
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            if (!this.target) {
                let enemyTowns = ai.getKnownEnemyTowns(state)
                    .sort((enemyTownA, enemyTownB) => unsafelyGetDistanceBetween(enemyTownA.mapSquare, unit) - unsafelyGetDistanceBetween(enemyTownB.mapSquare, unit))
                this.target = enemyTowns[0]
            }

            const { target } = this
            if (!target) { return null }
            const distance = getDistanceBetween(target, unit)
            debugLogAtLevel(3)(`*${unit.indexNumber}*${unit.description} at [${unit.x}, ${unit.y}] and wants to conquer the town at [${target.x}, ${target.y}] - ${distance} away`)

            const moveToAttack = possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
            return moveToAttack || chooseMoveTowards(target, unit, state, possibleMoves)
        }
    ),
    INTERCEPT: new UnitMissionType('INTERCEPT',
        function (unit: Unit, state: GameState) {
            if (this.untilCancelled) { return false }
            const ai = unit.faction.computerPersonality
            return this.range
                ? ai.getKnownEnemyUnitInOpen(state)
                    .filter(enemyUnit => unsafelyGetDistanceBetween(enemyUnit, unit) < this.range)
                    .length === 0
                : ai.getKnownEnemyUnitInOpen(state)
                    .length === 0
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            let knownEnemyUnitInOpen = ai.getKnownEnemyUnitInOpen(state)
                .sort((enemyUnitA, enemyUnitB) => unsafelyGetDistanceBetween(enemyUnitA, unit) - unsafelyGetDistanceBetween(enemyUnitB, unit))

            return chooseMoveTowards(knownEnemyUnitInOpen[0], unit, state, possibleMoves)

        }
    ),
    GO_TO_MY_NEAREST_TOWN: new UnitMissionType('GO_TO_MY_NEAREST_TOWN',
        function (unit: Unit, state: GameState) {
            return state.towns.some(town => town.faction === unit.faction && areSamePlace(town, unit))
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {

            let myTowns = state.towns
                .filter(town => town.faction === unit.faction)
                .sort(sortByDistanceFrom(unit))

            if (!myTowns[0]) { return null }

            return chooseMoveTowards(myTowns[0], unit, state, possibleMoves)

        }
    ),
    DEFEND_CURRENT_PLACE: new UnitMissionType('DEFEND_CURRENT_PLACE',
        function (unit: Unit, state: GameState) {
            return false
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {
            if (possibleActions.includes(orderTypesMap['Fortify'])) {
                return orderTypesMap['Fortify']
            }
            return null
        }
    ),
    BUILD_NEW_TOWN: new UnitMissionType('BUILD_NEW_TOWN',
        function (unit: Unit, state: GameState) {
            return false
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {

            const minimumTownLocationScore = 30

            if (!this.target) {
                let possibleNewTownLocationsWithScores = ai.getPossibleNewTownLocations(state)
                    .map(mapSquare => {
                        return { mapSquare, score: ai.assesNewTownLocation(mapSquare, ai.faction.worldMap).score }
                    })
                    .filter(item => item.score >= minimumTownLocationScore)
                    .sort((itemA, itemB) => itemB.score - itemA.score)

                if (possibleNewTownLocationsWithScores.length > 0) {
                    this.target = possibleNewTownLocationsWithScores[0].mapSquare
                    debugLogAtLevel(3)(
                        `${unit.description} has choosed a place to build town, with score:`, 
                        this.target, 
                        possibleNewTownLocationsWithScores[0].score
                    )
                } else {
                    debugLogAtLevel(3)(`${unit.description} has no a place to build town.`)
                }
            }

            if (!this.target) { return null }

            if (areSamePlace(unit, this.target)) {
                if (possibleActions.includes(orderTypesMap['Build Town'])) {
                    return orderTypesMap['Build Town']
                }
            }

            return chooseMoveTowards(this.target, unit, state, possibleMoves)

        },
    ),
    EXPLORE: new UnitMissionType('EXPLORE',
        function (unit: Unit, state: GameState) {
            return false
        },
        function (ai: ComputerPersonality, unit: Unit, state: GameState, possibleMoves: Array<MapSquare>, possibleActions: Array<OngoingOrderType>) {

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

            if (!this.target || areSamePlace(unit, this.target)) {
                let placesWithSpacesNearby = map.flat()
                    .filter(mapSquare => mapSquare !== null)
                    .filter(mapSquare => hasSpaceNearby(mapSquare))
                    .filter(mapSquare => unit.getCouldEnter(mapSquare))
                    .sort(sortByDistanceFrom(unit))

                if (placesWithSpacesNearby.length > 0) {
                    this.target = placesWithSpacesNearby[0]
                    debugLogAtLevel(3)(`Exploring ${unit.description} [${unit.x},${unit.y}] going to`, this.target)
                }
            }

            if (!this.target) { return null }
            return chooseMoveTowards(this.target, unit, state, possibleMoves)
        },
    )
}

export { unitMissionTypes, UnitMissionType }