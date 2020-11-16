import TradeBudget from '../TradeBudget.js'
import { buildingTypes } from './BuildingType.tsx'
import { Town } from './Town.tsx'
import { Unit } from './Unit.tsx'
import { TechDiscovery, techDiscoveries } from './TechDiscovery.tsx'
import { MapSquare } from './MapSquare.tsx'


class Faction {
    name: string;
    color: string;
    treasury: number;
    research: number;
    budget: TradeBudget;
    researchGoal: TechDiscovery | null;
    knownTech: Array<TechDiscovery>;
    worldMap: Array<Array<MapSquare>>;
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
    }

    updateWorldMap(state) {
        const { towns, units, mapGrid } = state
        let placesInSight = this.getPlacesInSight(towns, units)
            .filter(place => place.y >= 0 && place.x >= 0 && place.y < mapGrid.length && place.x < mapGrid[0].length)

        placesInSight.forEach(place => {
            if (!this.worldMap[place.y]) { this.worldMap[place.y] = [] }
            this.worldMap[place.y][place.x] = mapGrid[place.y][place.x].duplicate()
        })
    }

    allocateTownRevenue(town: Town) {
        let townRevenue = this.budget.allocate(town.output.tradeYield)

        if (town.buildings.includes(buildingTypes.marketplace)) {
            townRevenue.treasury += Math.floor(townRevenue.treasury / 2)
        }

        if (town.buildings.includes(buildingTypes.library)) {
            townRevenue.research += Math.floor(townRevenue.research / 2)
        }

        return townRevenue
    }

    calcuateAllocatedBudget(myTowns: Array<Town>) {
        let total = {
            treasury: 0,
            research: 0,
            entertainment: 0,
            totalTrade: 0,
        }
        myTowns.forEach(town => {
            const townOutput = this.allocateTownRevenue(town)
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
        const { towns } = state
        const myTowns = towns.filter(town => town.faction === this)
        let notices = []

        const allocatedBudget = this.calcuateAllocatedBudget(myTowns)
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

    getPlacesInSight(towns: Array<Town>, units: Array<Unit>) {
        const myTowns = towns.filter(town => town.faction === this)
        const myUnits = units.filter(unit => unit.faction === this)

        const places = [], results = []

        function addPlacesInRange(item, range) {
            let x, y;
            for (x = item.x - range; x < item.x + range + 1; x++) {
                for (y = item.y - range; y < item.y + range + 1; y++) {
                    places.push({ x, y })
                }
            }
        }

        myTowns.forEach(town => { addPlacesInRange(town, 3) })
        myUnits.forEach(unit => { addPlacesInRange(unit, 2) })

        let i;
        for (i = 0; i < places.length; i++) {
            if (!results.some(place => place.x == places[i].x && place.y == places[i].y)) {
                results.push(places[i])
            }
        }

        return results
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
        let output = {
            budget: this.budget.store,
            researchGoal: this.researchGoal ? this.researchGoal.name : false,
            knownTech: this.knownTech.map(techDiscovery => techDiscovery.name),
            worldMap: MapSquare.serialiseGrid(this.worldMap)
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') {
                output[key] = this[key]
            }
        })
        return output
    }

    static deserialise(data) {
        return new Faction(data.name, {
            color: data.color,
            treasury: data.treasury,
            research: data.research,
            budget: data.budget,
            researchGoal: data.researchGoal ? techDiscoveries[data.researchGoal] : null,
            knownTech: data.knownTech.map(techName => techDiscoveries[techName]),
            worldMap: MapSquare.deserialiseGrid(data.worldMap)
        })
    }
}

export { Faction }