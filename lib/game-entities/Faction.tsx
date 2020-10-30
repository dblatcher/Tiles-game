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

        this.budget = new TradeBudget()
        this.budget.setAll(config.buget || {
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
}

export { Faction }