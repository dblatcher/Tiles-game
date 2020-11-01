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

    calcuateAllocatedBudget(myTowns) {
        let totalTrade = 0
        myTowns.forEach(town => {
            //TO DO - add up town maintenance costs
            totalTrade += town.output.tradeYield
        })
        return this.budget.allocate(totalTrade)
    }

    processTurn(state) {
        const {towns} = state
        let notices = []

        const allocatedBudget = this.calcuateAllocatedBudget(towns.filter(town => town.faction === this))
        this.research += allocatedBudget.research
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