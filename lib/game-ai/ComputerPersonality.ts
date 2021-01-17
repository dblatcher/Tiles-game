import { UnitMission } from './UnitMission';
import { techDiscoveries, TechDiscovery } from '../game-entities/TechDiscovery';
import attemptMove from '../game-logic/attemptMove'

import gameActions from '../game-logic/gameActions'
import townActions from '../game-logic/townActions'
import { areSamePlace, pickAtRandom, sortByDistanceFrom, unsafelyCheckAreSamePlace, unsafelyGetDistanceBetween } from '../utility';
import { MINIMUM_DISTANCE_BETWEEN_TOWNS } from '../game-logic/constants'

import { GameState } from '../game-entities/GameState'
import { ComputerFaction, Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { citizenJobs } from '../game-entities/CitizenJob';
import { Citizen } from '../game-entities/Citizen';

import { debugLogAtLevel } from '../logging'
import { Town } from '../game-entities/Town';
import { orderTypesMap } from '../game-entities/OngoingOrder';
import { UnitType, unitTypes } from '../game-entities/UnitType';
import { BuildingType, buildingTypes } from '../game-entities/BuildingType';

class ComputerPersonalityConfig {
    minimumTownLocationScore?: number
    defendersPerTown?: number
    expandPriority?: number
    developPriority?: number
    discoverPriority?: number
    conquerPriority?: number
}

class PrioritySpend {
    "EXPAND": number
    "DEVELOP": number
    "DISCOVER": number
    "CONQUER": number
    constructor() {
        this.EXPAND = 1
        this.DEVELOP = 1
        this.DISCOVER = 1
        this.CONQUER = 1
    }

    /**
     * Multiply each goal score by the inverse of the ComputerPersonality's corresponding priority
     * eg a ComputerPersonality with a high conquerPriority will reduce its conquer goal score relative to the others
     * making a conquer choice high priority
     * @param ai the ComputerPersonality to adjust for
     */
    adjustByAiPriority(ai: ComputerPersonality) {
        this.CONQUER *= (1 / ai.conquerPriority)
        this.DEVELOP *= (1 / ai.developPriority)
        this.DISCOVER *= (1 / ai.discoverPriority)
        this.EXPAND *= (1 / ai.expandPriority)
        return this
    }

    /**
     * set the scores on a blank PriortySpend object based on a faction's knownTech and its ai priorities
     * @param faction 
     * @return the modified PriortySpend object
     */
    setScoresForTech(faction: ComputerFaction) {
        faction.knownTech.forEach(tech => {
            this[tech.aiPriority] += tech.getTier(techDiscoveries) + 1
        });
        this.adjustByAiPriority(faction.computerPersonality)
        return this
    }

    /**
     * set the scores on a blank PriortySpend object based on a town's situation, the overal gameState and its ai priorities
     * @param town 
     * @param state 
     * @return the modified PriortySpend object
     */
    setScoresForProduction(town: Town, state: GameState) {

        town.buildings.forEach(building => {
            this[building.aiPriority] += 5
        });

        // NOTE - this is crude - uses all units the faction has to make a decide about a particular town
        // doesn't consider proximity to the town
        state.units
            .filter(unit => unit.faction === town.faction)
            .forEach(unit => {
                switch (unit.type.role) {
                    case "ATTACKER":
                    case "CAVALRY":
                        this.CONQUER += 1
                        break;
                    case "SETTLER":
                        this.EXPAND += 10
                        break;
                    case "TRADER":
                    case "WORKER":
                        this.DEVELOP += 2
                        break;
                    case "SCOUT":
                        this.DISCOVER += 2
                }
            })

        this.adjustByAiPriority(town.faction.computerPersonality)
        return this
    }

    /**
     * the list or goals in order - lowest score(highest priority) first
     */
    get goalsInOrder() {
        return Object.keys(this).sort((goalA, goalB) => this[goalA] - this[goalB])
    }
}

class ComputerPersonality {
    faction: Faction;
    minimumTownLocationScore: number
    defendersPerTown: number
    expandPriority: number
    developPriority: number
    discoverPriority: number
    conquerPriority: number

    constructor(faction: Faction, config: ComputerPersonalityConfig = {}) {
        this.faction = faction
        this.minimumTownLocationScore = config.minimumTownLocationScore || 20
        this.defendersPerTown = typeof config.defendersPerTown === 'number' ? config.defendersPerTown : 1
        this.expandPriority = typeof config.expandPriority === 'number' ? config.expandPriority : 1
        this.developPriority = typeof config.developPriority === 'number' ? config.developPriority : 1
        this.discoverPriority = typeof config.discoverPriority === 'number' ? config.discoverPriority : 1
        this.conquerPriority = typeof config.conquerPriority === 'number' ? config.conquerPriority : 1
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
        let item = null as UnitType | BuildingType;
        let { producableUnits, producableBuildings } = this.faction
        producableBuildings = producableBuildings
            .filter(buildingType => !town.buildings.includes(buildingType))

        // defenders are first priority for the town
        const wantsToAddDefender = this.wantsToAddDefender(town, state)

        if (wantsToAddDefender) {
            item = this.faction.bestDefensiveLandUnit
        } else {
            const goalsInOrder = new PrioritySpend().setScoresForProduction(town, state).goalsInOrder
            let usefulBuildingsForGoal = []; 

            for (let i = 0; i < goalsInOrder.length; i++) {
                usefulBuildingsForGoal = producableBuildings
                    .filter(buildingType => buildingType.aiPriority === goalsInOrder[i])
                    .filter(buildingType => buildingType.checkIfUsefulFor(town, state))


                switch (goalsInOrder[i]) {
                    case "EXPAND":
                        if (!town.supportedUnits.some(unit => unit.role === 'SETTLER')) {
                            item = unitTypes.settler
                        } else{
                            item = pickAtRandom(usefulBuildingsForGoal)
                        }
                        break;
                    case "DEVELOP":
                        item = pickAtRandom([...usefulBuildingsForGoal, unitTypes.worker])
                        break;
                    case "DISCOVER":
                        item = pickAtRandom(usefulBuildingsForGoal)
                        break;
                    case "CONQUER":
                        item = Math.random() > .75
                            ? pickAtRandom(usefulBuildingsForGoal) || pickAtRandom([this.faction.bestLandAttacker, this.faction.bestCavalryUnit])
                            : pickAtRandom([this.faction.bestLandAttacker, this.faction.bestCavalryUnit])
                        break;
                }
                if (item) { break }
                debugLogAtLevel(3)(`****${town.name} could not choose a ${goalsInOrder[i]} item.`)
            }
            
            if (!item) {
                debugLogAtLevel(3)(`****${town.name} picking at random`)
                item = pickAtRandom([...producableBuildings, ...producableUnits])
            }
        }

        debugLogAtLevel(2)(`** pickNextProductionItem: ${town.name} picks ${item.name}`)
        return item
    }

    pickNewTech(state: GameState) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech)) as TechDiscovery[]

        const goalsInOrder = new PrioritySpend().setScoresForTech(this.faction).goalsInOrder
        let choosenTechDiscovery = possibleChoices[0]
        let possibleChoicesForGoal = []

        for (let i = 0; i < goalsInOrder.length; i++) {
            possibleChoicesForGoal = possibleChoices.filter(tech => tech.aiPriority === goalsInOrder[i])
            if (possibleChoicesForGoal.length > 0) {
                choosenTechDiscovery = possibleChoicesForGoal[Math.floor(Math.random() * possibleChoicesForGoal.length)]
                break;
            }
        }

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
                new UnitMission('INTERCEPT', { range: 3 }),
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
                new UnitMission('DEFEND_NEAREST_VULNERABLE_TOWN', {}),
                new UnitMission('INTERCEPT', { range: 1 }),
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
            minimumTownLocationScore: this.minimumTownLocationScore,
            defendersPerTown: this.defendersPerTown,
            expandPriority: this.expandPriority,
            developPriority: this.developPriority,
            discoverPriority: this.discoverPriority,
            conquerPriority: this.conquerPriority,
        }
    }

}



export { ComputerPersonality, ComputerPersonalityConfig }