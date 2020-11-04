import TradeBudget from '../TradeBudget.js'

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
            treasury: 1/2,
            research: 1/2,
            entertainment: 0,
        })
    }

    allocateTownRevenue(town) {
        return this.budget.allocate(town.output.tradeYield)
    }

    calcuateAllocatedBudget(myTowns) {
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

    calculateTotalMaintenceCost(myTowns) {
        return myTowns.reduce((accumulator, town) => accumulator + town.buildingMaintenanceCost, 0)
    }

    processTurn(state) {
        const {towns} = state
        const myTowns = towns.filter(town => town.faction === this)
        let notices = []

        const allocatedBudget = this.calcuateAllocatedBudget(myTowns)
        const buildingMaintenanceCost = this.calculateTotalMaintenceCost(myTowns)
        this.research += allocatedBudget.research
        this.treasury -= buildingMaintenanceCost
        this.treasury += allocatedBudget.treasury
        return notices
    }

    checkIfAlive (state) {
        const {towns, units} = state
        if (towns.filter(town => this === town.faction).length === 0 && units.filter(unit => this === unit.faction).length === 0) {
            return false
        }
        return true
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