import { UnitMission } from './UnitMission';
import { techDiscoveries, TechDiscovery } from '../game-entities/TechDiscovery';
import attemptMove from '../game-logic/attemptMove'

import gameActions from '../game-logic/gameActions'
import townActions from '../game-logic/townActions'
import { areSamePlace, sortByDistanceFrom, unsafelyCheckAreSamePlace, unsafelyGetDistanceBetween } from '../utility';
import { MINIMUM_DISTANCE_BETWEEN_TOWNS } from '../game-logic/constants'

import { GameState } from '../game-entities/GameState'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { citizenJobs } from '../game-entities/CitizenJob';
import { Citizen } from '../game-entities/Citizen';

import { debugLogAtLevel } from '../logging'
import { Town } from '../game-entities/Town';
import { orderTypesMap } from '../game-entities/OngoingOrder';
import { UnitType, unitTypes } from '../game-entities/UnitType';
import { BuildingType, buildingTypes } from '../game-entities/BuildingType';
import { hasPathTo, sortByTotalMovemoveCostFor } from './pathfinding';

class ComputerPersonalityConfig {
    minimumTownLocationScore?: number
    defendersPerTown?: number
}

class ComputerPersonality {
    faction: Faction;
    minimumTownLocationScore: number
    defendersPerTown: number

    constructor(faction: Faction, config: ComputerPersonalityConfig = {}) {
        this.faction = faction
        this.minimumTownLocationScore = config.minimumTownLocationScore || 20
        this.defendersPerTown = typeof config.defendersPerTown === 'number' ? config.defendersPerTown : 1
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

            let item: UnitType | BuildingType = null
            if (!town.isProducing || town.productionStore === 0) {
                item = this.pickNextProductionItem(town, state);
                townActions.PRODUCTION_PICK({ town, item })(state)
            } else if (this.wantsToAddDefender(town, state)) {
                item = this.faction.bestDefensiveLandUnit
                townActions.PRODUCTION_PICK({ town, item })(state)
                debugLogAtLevel(2)(`** ${town.name} building defender ${town.isProducing.name}`)
            }

        })
    }

    pickNextProductionItem(town: Town, state: GameState) {
        //TO DO - logic for computer picking a production item
        let { producableUnits, producableBuildings } = this.faction
        producableBuildings = producableBuildings
            .filter(buildingType => !town.buildings.includes(buildingType))

        const wantsToAddDefender = this.wantsToAddDefender(town, state)
        let pickingBuilding = !wantsToAddDefender && false && producableBuildings.length > 0

        let randomBuilding = producableBuildings[Math.floor(Math.random() * producableBuildings.length)]
        let randomUnit = producableUnits[Math.floor(Math.random() * producableUnits.length)]


        let pickedUnit = wantsToAddDefender
            ? this.faction.bestDefensiveLandUnit
            : Math.random() > .5
                ? this.faction.bestCavalryUnit || randomUnit
                : this.faction.bestLandAttacker || randomUnit

        const item = pickingBuilding
            ? randomBuilding
            : pickedUnit

        debugLogAtLevel(2)(`** pickNextProductionItem: ${town.name} picks ${item.name}`)
        return item
    }

    pickNewTech(state: GameState) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech))

        //TO DO - logic for computer picking a tech based on computerPersonality goals
        const choosenTechDiscovery = possibleChoices[0]

        debugLogAtLevel(2)(`** ${this.faction.name} AI is now researching ${choosenTechDiscovery.name}`)
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

    wantsToAddDefender(town: Town, state: GameState) {
        const defendersPresent = state.units
            .filter(unit => unit.faction === this.faction)
            .filter(unit => areSamePlace(unit, town))
            .filter(unit => unit.onGoingOrder)
            .filter(unit =>
                unit.onGoingOrder.type == orderTypesMap['Fortify'] || unit.onGoingOrder.type == orderTypesMap['Fortified']
            )

        const defefendersEnroute = state.units
            .filter(unit => unit.faction === this.faction)
            .filter(unit => unit.missions.some(mission => mission.type == "DEFEND_TOWN_AT" && areSamePlace(mission.target, town)))

        debugLogAtLevel(5)({ town, defendersPresent, defefendersEnroute })

        // TO DO - count defefendersEnroute in a smarter way - weight by distance?
        return defendersPresent.length + (defefendersEnroute.length / 2) < this.defendersPerTown
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

        if (unit.role === "ATTACKER") {
            unit.missions.push(
                new UnitMission('CONQUER', {}),
                new UnitMission('INTERCEPT', {range: 3}),
                new UnitMission('EXPLORE'),
            )
        }
        if (unit.role === "CAVALRY") {
            unit.missions.push(
                new UnitMission('INTERCEPT', {}),
                new UnitMission('CONQUER', {}),
                new UnitMission('EXPLORE'),
            )
        }
        if (unit.role === "DEFENDER") {
            unit.missions.push(
                new UnitMission('DEFEND_NEAREST_VULNERABLE_TOWN',{}),
                new UnitMission('INTERCEPT', {range: 1}),
                new UnitMission('GO_TO_MY_NEAREST_TOWN')
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

    pickStolenTech(options: TechDiscovery[], state: GameState) {
        let index = Math.floor(Math.random() * options.length)
        return options[index]
    }

    makeMove(state: GameState) {
        let moveSuceeded = false;
        const unit = state.selectedUnit;


        if (unit && unit.remainingMoves > 0) {
            debugLogAtLevel(3)(`*${unit.indexNumber}* ${this.faction.name} moving ${unit.description} (${unit.role})`)
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

        debugLogAtLevel(2)(`__${movesMade} MOVES MADE__`, result ? 'FINISHED' : '')
        return result
    }

    get serialised() {
        return {
            minimumTownLocationScore: this.minimumTownLocationScore
        }
    }

}



export { ComputerPersonality, ComputerPersonalityConfig }