import TradeBudget from '../TradeBudget'
import { BuildingType, buildingTypes } from './BuildingType'
import { Town } from './Town'
import { Unit } from './Unit'
import { UnitType, unitTypes } from './UnitType'
import { TechDiscovery, techDiscoveries } from './TechDiscovery'
import { MapSquare } from './MapSquare'
import { ComputerPersonality, ComputerPersonalityConfig } from '../game-ai/ComputerPersonality'

import { TOWN_SIGHT_RADIUS, UNIT_SIGHT_RADIUS } from '../game-logic/constants'
import { areSamePlace } from '../utility.js'
import { GameState } from './GameState'

interface FactionConfig {
    color?: string
    treasury?:number
    research?:number
    researchGoal?: TechDiscovery
    knownTech? :TechDiscovery[]
    worldMap? : MapSquare[][]
    budget?: {
        treasury: number
        research: number
        entertainment:number
    }
    townNames?: string[]
    placesInSightThisTurn?: object[]
}


class Faction {
    name: string;
    color: string;
    treasury: number;
    research: number;
    budget: TradeBudget;
    researchGoal: TechDiscovery | null;
    knownTech: Array<TechDiscovery>;
    worldMap: Array<Array<MapSquare | null> | null>;
    computerPersonality: ComputerPersonality;
    placesInSightThisTurn: Array<object>;
    townNames: Array<string>;
    constructor(name: string, config: FactionConfig = {}) {
        this.name = name;
        this.color = config.color || "#FFF";
        this.treasury = config.treasury || 0
        this.research = config.research || 0

        this.researchGoal = config.researchGoal || null
        this.knownTech = config.knownTech || []
        this.worldMap = config.worldMap || [[]]

        this.budget = new TradeBudget().setAll(config.budget || {
            treasury: 1 / 2,
            research: 1 / 2,
            entertainment: 0,
        })

        this.townNames = config.townNames || []

        this.placesInSightThisTurn = config.placesInSightThisTurn || []
        this.computerPersonality = null
    }

    get isComputerPlayer() { return false }
    get isBarbarianFaction() { return false }

    updateWorldMap(state) {
        const { towns, units, mapGrid } = state
        let placesInSight = this.getPlacesInSight(towns, units, mapGrid[0].length)
            .filter(place => place.y >= 0 && place.x >= 0 && place.y < mapGrid.length && place.x < mapGrid[0].length)

        placesInSight.forEach(place => {
            if (!this.worldMap[place.y]) { this.worldMap[place.y] = [] }
            this.worldMap[place.y][place.x] = mapGrid[place.y][place.x].duplicate()
        })
    }

    allocateTownRevenue(town: Town, excludeCitizenBonus: boolean = false) {
        let townRevenue = this.budget.allocate(town.output.tradeYield)

        if (!excludeCitizenBonus) {
            town.citizens.forEach(citizen => {
                const { revenueAdditionBonus } = citizen.job
                if (revenueAdditionBonus) {
                    for (let revenueType in revenueAdditionBonus) {
                        townRevenue[revenueType] += revenueAdditionBonus[revenueType]
                    }
                }
            })
        }

        town.buildings.forEach(buildingType => {
            const { revenueMultiplierBonus } = buildingType
            if (revenueMultiplierBonus) {
                for (let revenueType in revenueMultiplierBonus) {
                    townRevenue[revenueType] += Math.floor(townRevenue[revenueType] * revenueMultiplierBonus[revenueType])
                }
            }
        })
        return townRevenue
    }

    calcuateAllocatedBudget(myTowns: Array<Town>, excludeCitizenBonus: boolean = false) {
        let total = {
            treasury: 0,
            research: 0,
            entertainment: 0,
            totalTrade: 0,
        }
        myTowns.forEach(town => {
            const townOutput = this.allocateTownRevenue(town, excludeCitizenBonus)
            total.treasury += townOutput.treasury
            total.research += townOutput.research
            total.entertainment += townOutput.entertainment
            total.totalTrade += townOutput.totalTrade
        })
        return total
    }

    calculateTotalMaintenceCost(myTowns: Array<Town>) {
        return myTowns.reduce((accumulator, town) => accumulator + town.buildingMaintenanceCost, 0)
    }

    getActualBudget(state: GameState) {
        const { towns, units } = state
        const myTowns = towns.filter(town => town.faction === this)
        return this.calcuateAllocatedBudget(myTowns.filter(town => !town.getIsInRevolt(units)))
    }

    processTurn(state: GameState) {
        const myTowns = state.towns.filter(town => town.faction === this)
        let notices = []

        const allocatedBudget = this.getActualBudget(state)
        const buildingMaintenanceCost = this.calculateTotalMaintenceCost(myTowns)
        this.research += allocatedBudget.research
        this.treasury -= buildingMaintenanceCost
        this.treasury += allocatedBudget.treasury

        if (this.researchGoal && this.research >= this.researchGoal.researchCost) {
            notices.push(`${this.name} has discovered ${this.researchGoal.description}`)
            this.knownTech.push(this.researchGoal)
            this.researchGoal = null
            this.research = 0
        }

        this.updateWorldMap(state)
        return notices
    }

    checkIfAlive(state: GameState) {
        const { towns, units } = state
        if (towns.filter(town => this === town.faction).length === 0 && units.filter(unit => this === unit.faction).length === 0) {
            return false
        }
        return true
    }

    updatePlacesInSightThisTurn(state: GameState) {
        const { towns, units, mapGrid } = state
        const mapWidth = mapGrid && mapGrid[0]
            ? mapGrid[0].length
            : 0

        const newPlaces = this.getPlacesInSight(towns, units, mapWidth)
            .filter(place => !this.placesInSightThisTurn.some(existingPlace => areSamePlace(existingPlace, place)))

        this.placesInSightThisTurn = this.placesInSightThisTurn.concat(newPlaces)
    }

    //TO DO - use GameState as argument
    getPlacesInSight(towns: Array<Town>, units: Array<Unit>, mapWidth: number) {
        const myTowns = towns.filter(town => town.faction === this)
        const myUnits = units.filter(unit => unit.faction === this)

        const places = [], results = []

        function addPlacesInRange(item, range) {
            let x, y;
            for (x = item.x - range; x < item.x + range + 1; x++) {
                for (y = item.y - range; y < item.y + range + 1; y++) {
                    places.push({ x: wrapXValue(x), y })
                }
            }

            function wrapXValue(x) {
                return x < 0
                    ? x + mapWidth
                    : x >= mapWidth
                        ? x - mapWidth
                        : x
            }
        }

        myTowns.forEach(town => { addPlacesInRange(town, TOWN_SIGHT_RADIUS) })
        myUnits.forEach(unit => { addPlacesInRange(unit, UNIT_SIGHT_RADIUS) })

        let i;
        for (i = 0; i < places.length; i++) {
            if (!results.some(place => place.x == places[i].x && place.y == places[i].y)) {
                results.push(places[i])
            }
        }

        return results
    }

    get producableUnits() {
        return Object.keys(unitTypes)
            .map(key => unitTypes[key])
            .filter(unitType => unitType.checkCanBuildWith(this.knownTech)) as UnitType[]
    }

    get bestDefensiveLandUnit() {
        const { producableUnits } = this
        const noUnitsWithMatchingRole = !producableUnits.some(unitType => unitType.role == 'DEFENDER')
        return producableUnits
            .filter(unitType => !unitType.isNaval)
            .filter(unitType => unitType.role === 'DEFENDER' || noUnitsWithMatchingRole)
            .sort((typeA, typeB) => typeB.defend - typeA.defend)[0] || null
    }

    get bestLandAttacker() {
        const { producableUnits } = this
        const noUnitsWithMatchingRole = !producableUnits.some(unitType => unitType.role == 'ATTACKER')
        return producableUnits
            .filter(unitType => !unitType.isNaval)
            .filter(unitType => unitType.role === 'ATTACKER' || noUnitsWithMatchingRole)
            .sort((typeA, typeB) => typeB.attack - typeA.attack)[0] || null
    }

    get bestCavalryUnit() {
        const { producableUnits } = this

        return producableUnits
            .filter(unitType => !unitType.isNaval)
            .filter(unitType => unitType.role === 'CAVALRY')
            .sort((typeA, typeB) => typeB.attack - typeA.attack)[0] || null
    }

    get producableBuildings() {
        return Object.keys(buildingTypes)
            .map(key => buildingTypes[key])
            .filter(buildingType => buildingType.checkCanBuildWith(this.knownTech)) as BuildingType[]
    }

    get possibleResearchGoals() {
        let techDiscoveryChoices = []
        for (let techName in techDiscoveries) {
            if (techDiscoveries[techName].checkCanResearchWith(this.knownTech)) {
                techDiscoveryChoices.push(techDiscoveries[techName])
            }
        }
        return techDiscoveryChoices
    }

    get serialised() {

        // fix for using function, not class...
        let { store } = this.budget as any

        let output = {
            budget: store,
            researchGoal: this.researchGoal ? this.researchGoal.name : false,
            knownTech: this.knownTech.map(techDiscovery => techDiscovery.name),
            worldMap: MapSquare.serialiseGrid(this.worldMap),
            townNames: this.townNames.map(name => name),
            computerPersonality: null,
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') {
                output[key] = this[key]
            }
        })
        return output
    }

    static deserialise(data) {

        const correctClass = data.computerPersonality ? ComputerFaction : Faction
        return new correctClass(
            data.name,
            {
                color: data.color,
                treasury: data.treasury,
                research: data.research,
                budget: data.budget,
                researchGoal: data.researchGoal ? techDiscoveries[data.researchGoal] : null,
                knownTech: data.knownTech.map(techName => techDiscoveries[techName]),
                worldMap: MapSquare.deserialiseGrid(data.worldMap),
                placesInSightThisTurn: data.placesInSightThisTurn,
                townNames: data.townNames,
            },
            data.computerPersonality)
    }
}

class ComputerFaction extends Faction {
    computerPersonality: ComputerPersonality;
    constructor(name: string, config: any, computerPersonality: ComputerPersonalityConfig = {}) {
        super(name, config)
        this.computerPersonality = new ComputerPersonality(this, computerPersonality)
    }

    get isComputerPlayer() { return true }
    get isBarbarianFaction() { return false }

    get serialised() {

        // fix for using function, not class...
        let { store } = this.budget as any

        let output = {
            budget: store,
            researchGoal: this.researchGoal ? this.researchGoal.name : false,
            knownTech: this.knownTech.map(techDiscovery => techDiscovery.name),
            worldMap: MapSquare.serialiseGrid(this.worldMap),
            townNames: this.townNames.map(name => name),
            computerPersonality: this.computerPersonality.serialised
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') {
                output[key] = this[key]
            }
        })
        return output
    }

}

class BarbarianFaction extends ComputerFaction {
    get isBarbarianFaction() { return true }

    constructor() {
        super('barbarian', {color:'#ddd'})
        this.computerPersonality = new ComputerPersonality(this, {conquerPriority:10})
    }

    static getFaction(state:GameState) {
        let barbarians:Faction;
        if (state.factions.find(faction => faction.isBarbarianFaction)) {
            barbarians = state.factions.find(faction => faction.isBarbarianFaction)
        } else {
            barbarians = new BarbarianFaction()
            state.factions.push(barbarians)
        }
        return barbarians
    }

}

export { Faction, ComputerFaction, BarbarianFaction }