import TradeBudget from '../TradeBudget'
import { buildingTypes } from './BuildingType'
import { Town } from './Town'
import { Unit } from './Unit'
import { unitTypes } from './UnitType'
import { TechDiscovery, techDiscoveries } from './TechDiscovery'
import { MapSquare } from './MapSquare'
import { ComputerPersonality } from '../game-ai/ComputerPersonality'

import { TOWN_SIGHT_RADIUS, UNIT_SIGHT_RADIUS } from '../game-logic/constants'
import { areSamePlace } from '../utility.js'

class Faction {
    name: string;
    color: string;
    treasury: number;
    research: number;
    budget: TradeBudget;
    researchGoal: TechDiscovery | null;
    knownTech: Array<TechDiscovery>;
    worldMap: Array<Array<MapSquare | null> | null>;
    computerPersonality: null;
    placesInSightThisTurn: Array<object>;
    townNames: Array<String>;
    constructor(name: string, config: any = {}) {
        this.name = name;
        this.color = config.color || "#FFF";
        this.treasury = config.treasury || 0
        this.research = config.research || 0

        this.researchGoal = config.researchGoal || null
        this.knownTech = config.knownTech || []
        this.worldMap = config.worldMap || [[]]

        this.budget = new TradeBudget().setAll(config.buget || {
            treasury: 1 / 2,
            research: 1 / 2,
            entertainment: 0,
        })

        this.townNames = config.townNames || []

        this.placesInSightThisTurn = config.placesInSightThisTurn || []
        this.computerPersonality = null
    }

    get isComputerPlayer() { return false }

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

    processTurn(state) {
        const { towns, units } = state
        const myTowns = towns.filter(town => town.faction === this)
        let notices = []

        const allocatedBudget = this.calcuateAllocatedBudget(myTowns.filter(town => !town.getIsInRevolt(units)))
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

    checkIfAlive(state) {
        const { towns, units } = state
        if (towns.filter(town => this === town.faction).length === 0 && units.filter(unit => this === unit.faction).length === 0) {
            return false
        }
        return true
    }

    updatePlacesInSightThisTurn(state) {
        const { towns, units, mapGrid } = state
        const mapWidth = mapGrid && mapGrid[0]
            ? mapGrid[0].length
            : 0

        const newPlaces = this.getPlacesInSight(towns, units, mapWidth)
            .filter(place => !this.placesInSightThisTurn.some(existingPlace => areSamePlace(existingPlace, place)))

        this.placesInSightThisTurn = this.placesInSightThisTurn.concat(newPlaces)
    }

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
            .filter(unitType => unitType.checkCanBuildWith(this.knownTech))
    }

    get producableBuildings() {
        return Object.keys(buildingTypes)
            .map(key => buildingTypes[key])
            .filter(buildingType => buildingType.checkCanBuildWith(this.knownTech))
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
        let {store} = this.budget as any

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
    computerPersonality: any;
    constructor(name: string, config: any, computerPersonality: any = {}) {
        super(name, config)
        this.computerPersonality = new ComputerPersonality(this, computerPersonality)
    }

    get isComputerPlayer() { return true }

    get serialised() {

        // fix for using function, not class...
        let {store} = this.budget as any

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

export { Faction, ComputerFaction }