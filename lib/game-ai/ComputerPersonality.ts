import { UnitMission } from './UnitMission.ts';
import { techDiscoveries } from '../game-entities/TechDiscovery.tsx';
import attemptMove from '../game-logic/attemptMove'

import gameActions from '../game-logic/gameActions'
import townActions from '../game-logic/townActions'
import { unsafelyCheckAreSamePlace, unsafelyGetDistanceBetween } from '../utility';
import { MINIMUM_DISTANCE_BETWEEN_TOWNS } from '../game-logic/constants'

import { GameState } from '../game-entities/GameState'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { citizenJobs } from '../game-entities/CitizenJob.tsx';
import { Citizen } from '../game-entities/Citizen';

import { debugLogAtLevel } from '../logging'

class ComputerPersonality {
    faction: Faction;
    config: any;
    constructor(faction: Faction, config: any) {
        this.faction = faction
        this.config = config
    }

    manageTowns(state: GameState) {
        const myTowns = state.towns.filter(town => town.faction === this.faction)

        myTowns.forEach(town => {
            town.autoAssignFreeCitizens(state);

            if (town.getIsInRevolt(state.units)) {
                let happinessNeeded = town.getUnhappiness(state.units) - town.happiness
                let entertainersNeeded = Math.ceil(happinessNeeded / citizenJobs.entertainer.revenueAdditionBonus.entertainment)

                // TO DO - use this.config to determine priority - allow starvation over unrest / underproduction? 
                let citizensSortedByFoodYield: Citizen[] = town.citizens
                    .map((citizen: Citizen) => citizen)
                    .filter((citizen: Citizen) => citizen.job !== citizenJobs.entertainer)
                    .sort((citizenA: Citizen, citizenB: Citizen) => {
                        return citizenA.getOutput(town).foodYield - citizenB.getOutput(town).foodYield
                    })

                for (let i = 0; i < entertainersNeeded; i++) {
                    citizensSortedByFoodYield[i].changeJobTo(citizenJobs.entertainer)
                }

            }

            if (!town.isProducing) {
                const { producableUnits, producableBuildings } = this.faction
                //TO DO - logic for computer picking a production item
                let item
                item = producableUnits[Math.floor(Math.random() * producableUnits.length)]
                townActions.PRODUCTION_PICK({ town, item })(state)
                debugLogAtLevel(2)(`** ${town.name} now producing ${town.isProducing.name}`)
            }
        })
    }

    pickNewTech(state: GameState) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech))

        //TO DO - logic for computer picking a tech based on computerPersonality goals
        const choosenTechDiscovery = possibleChoices[0]

        debugLogAtLevel(1)(`** ${this.faction.name} AI is now researching ${choosenTechDiscovery.name}`)
        gameActions.CHOOSE_RESEARCH_GOAL({ activeFaction: this.faction, techDiscovery: choosenTechDiscovery })(state)
    }

    getKnownEnemyTowns(state: GameState) {
        return state.towns
            .filter(town => town.faction !== this.faction)
            .filter(town => this.faction.worldMap
                .flat()
                .filter(mapSquare => mapSquare !== null)
                .some(mapSquare => mapSquare.x === town.mapSquare.x && mapSquare.y === town.mapSquare.y))
    }

    getKnownEnemyUnits(state: GameState) {
        return state.units
            .filter(unit => unit.faction !== this.faction)
            .filter(unit => this.faction.worldMap[unit.y] && this.faction.worldMap[unit.y][unit.x])
    }

    getKnownEnemyUnitInOpen(state: GameState) {
        let enemyTowns = this.getKnownEnemyTowns(state)
        let enemyUnits = this.getKnownEnemyUnits(state)

        return enemyUnits
            .filter(unit => !enemyTowns.some(town => unsafelyCheckAreSamePlace(town.mapSquare, unit)))
    }

    getPossibleNewTownLocations(state: GameState) {
        const squaresTownsCouldBeBuiltOn = this.faction.worldMap
            .flat()
            .filter(mapSquare => mapSquare !== null)
            .filter(mapSquare => !mapSquare.terrain.neverTown)
            .filter(mapSquare => !state.towns.some(town => unsafelyGetDistanceBetween(town.mapSquare, mapSquare) < MINIMUM_DISTANCE_BETWEEN_TOWNS))

        return squaresTownsCouldBeBuiltOn
    }

    assesNewTownLocation(mapSquare: MapSquare, mapGrid: Array<Array<MapSquare | null> | null>) {

        const workableSquares = mapSquare.getWorkableSquaresAround(mapGrid)
        // TO DO - better scoring system 
        // one square that  yields 8 is more valuable than two that yields 4
        // balance matters - town with high production yield but v low food yield isnt good

        let foodYield = 0, productionYield = 0, tradeYield = 0;
        workableSquares.forEach(square => {
            foodYield += square.foodYield;
            productionYield += square.productionYield;
            tradeYield += square.tradeYield;
        })

        // give double weight to home square
        foodYield += mapSquare.foodYield * 2;
        productionYield += mapSquare.productionYield * 2;
        tradeYield += mapSquare.tradeYield * 2;

        return {
            mapSquare,
            workableSquares,
            foodYield,
            productionYield,
            tradeYield,
            score: foodYield + productionYield + tradeYield
        }
    }

    assignNewMission(unit: Unit, state: GameState) {
        // TO DO - logic for picking a mission...


        if (unit.role === "ATTACKER") {
            unit.missions.push(
                new UnitMission('CONQUER', {}),
                new UnitMission('INTERCEPT', { untilCancelled: false }),
                new UnitMission('EXPLORE'),
            )
        }
        if (unit.role === "CAVALRY") {
            unit.missions.push(
                new UnitMission('INTERCEPT', { range: 5, untilCancelled: true }),
                new UnitMission('CONQUER', {}),
                new UnitMission('EXPLORE'),
            )
        }
        if (unit.role === "DEFENDER") {
            unit.missions.push(
                new UnitMission('GO_TO_MY_NEAREST_TOWN', {}),
                new UnitMission('DEFEND_CURRENT_PLACE', {}),
            )
        }
        if (unit.role === "SETTLER") {
            unit.missions.push(
                new UnitMission('BUILD_NEW_TOWN', {}),
                new UnitMission('EXPLORE'),
            )
        }
        if (unit.role === "SCOUT" || unit.role === "WORKER") {
            unit.missions.push(
                new UnitMission('EXPLORE'),
            )
        }

        if (unit.missions.length == 0) {
            unit.missions.push(new UnitMission("WAIT"))
        }
    }

    makeMove(state: GameState) {
        let moveSuceeded = false;
        const unit = state.selectedUnit;


        if (unit && unit.remainingMoves > 0) {
            debugLogAtLevel(2)(`*${unit.indexNumber}* ${this.faction.name} moving ${unit.description} (${unit.role})`)
            unit.missions = unit.missions.filter(mission => !mission.checkIfFinished(unit, state))
            if (unit.missions.length == 0) { this.assignNewMission(unit, state) }


            let choosenMove = null
            for (let i = 0; i < unit.missions.length; i++) {
                choosenMove = unit.missions[i].chooseMove(unit, state)
                if (choosenMove && choosenMove.classIs === 'MapSquare') {
                    moveSuceeded = attemptMove(state, state.selectedUnit, choosenMove)
                    break;
                }
                else if (choosenMove && choosenMove.classIs === 'OnGoingOrderType') {
                    gameActions.START_ORDER({ unit: state.selectedUnit, orderType: choosenMove })(state)
                    moveSuceeded = true
                    break
                }
            }

            if (!moveSuceeded) {
                unit.remainingMoves = 0  // TO DO - don't like this - should be able to use 'Hold Unit' like a human player
                // if (!unit.onGoingOrder) {
                //     gameActions.START_ORDER({ unit: state.selectedUnit, orderType: orderTypesMap['Hold Unit'] })(state)
                // }
            }
        } else {
            gameActions.NEXT_UNIT({})(state)
        }
    }

    checkIfFinished(state: GameState, movesMade: number) {
        let result
        const myUnitsWithMovesLeft = state.units
            .filter(unit => unit.faction === this.faction)
            .filter(unit => unit.remainingMoves > 0 && !unit.onGoingOrder)

        result = myUnitsWithMovesLeft.length === 0

        debugLogAtLevel(1)(`__${movesMade} MOVES MADE__`, result ? 'FINISHED' : '')
        return result
    }

    get serialised() {
        return this.config
    }

}



export { ComputerPersonality }