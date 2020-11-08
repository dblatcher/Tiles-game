import TradeBudget from '../TradeBudget.js'
import { buildingTypes } from './BuildingType.tsx'
import { Town } from './Town.tsx'
import { Unit } from './Unit.tsx'

class Faction {
    name: string;
    color: string;
    treasury: number;
    research: number;
    budget: TradeBudget;
    constructor(name: string, config: any = {}) {
        this.name = name;
        this.color = config.color || "#FFF";
        this.treasury = config.treasury || 0
        this.research = config.research || 0

        this.budget = new TradeBudget().setAll(config.buget || {
            treasury: 1 / 2,
            research: 1 / 2,
            entertainment: 0,
        })
    }

    allocateTownRevenue(town:Town) {
        let townRevenue = this.budget.allocate(town.output.tradeYield)

        if (town.buildings.includes(buildingTypes.marketplace)) {
            townRevenue.treasury += Math.floor(townRevenue.treasury/2)
        }

        if (town.buildings.includes(buildingTypes.library)) {
            townRevenue.research += Math.floor(townRevenue.research/2)
        }

        return townRevenue
    }

    calcuateAllocatedBudget(myTowns:Array<Town>) {
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

    calculateTotalMaintenceCost(myTowns:Array<Town>) {
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
        return notices
    }

    checkIfAlive(state) {
        const { towns, units } = state
        if (towns.filter(town => this === town.faction).length === 0 && units.filter(unit => this === unit.faction).length === 0) {
            return false
        }
        return true
    }

    getPlacesInSight(towns:Array<Town>, units:Array<Unit>) {
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

    get serialised() {
        let output = {
            budget: this.budget.store
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
        })
    }
}

export { Faction }