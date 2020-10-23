import { Faction } from './Faction'
import { MapSquare } from './MapSquare'
import { UnitType, unitTypes } from './Unit'

let townIndex = 0

class CitizenJob {
    name: string;
    constructor(name) {
        this.name = name
    }
}

const citizenJobs = {
    unemployed: new CitizenJob('unemployed'),
    worker: new CitizenJob('worker'),
}

class Citizen {
    mapSquare: MapSquare | null;
    job: CitizenJob | null;

    constructor(mapSquare = null, job = citizenJobs.unemployed) {
        this.mapSquare = mapSquare
        this.job = job
    }

    putToWorkInSquare(mapSquare: MapSquare) {
        this.mapSquare = mapSquare
        this.job = citizenJobs.worker
    }

    makeUnemployed() {
        this.mapSquare = null
        this.job = citizenJobs.unemployed
    }

    get output() {
        if (this.mapSquare) {
            return {
                foodYield: this.mapSquare.foodYield,
                tradeYield: this.mapSquare.tradeYield,
                productionYield: this.mapSquare.productionYield,
            }
        }

        return {}
    }
}

class Town {
    faction: Faction;
    mapSquare: MapSquare;
    indexNumber: number;
    name: string;
    foodStore: number;
    productionStore: number;
    isProducing: UnitType | null;
    citizens: Array<Citizen>;
    constructor(faction: Faction, mapSquare:MapSquare, config: object = {}) {
        this.faction = faction;
        this.mapSquare = mapSquare;
        this.indexNumber = ++townIndex

        this.name = config.name || `TOWN#${townIndex}-${faction.name}`

        const population = config.population || 1
        this.citizens = []
        for (let i = 0; i < population; i++) {
            this.citizens.push(new Citizen())
        }

        this.foodStore = config.foodStore || 0
        this.productionStore = config.productionStore || 0
        this.isProducing = config.isProducing || null
    }

    get x() { return this.mapSquare.x}
    get y() { return this.mapSquare.y}
    get population() { return this.citizens.length}
    get foodStoreRequiredForGrowth() {return (this.population+1) * 10 }

    get output() {
        let output = {
            foodYield: this.mapSquare.foodYield,
            productionYield: this.mapSquare.productionYield,
            tradeYield: this.mapSquare.tradeYield
        }
        this.citizens.forEach(citizen => {
            const { foodYield = 0, productionYield = 0, tradeYield = 0 } = citizen.output
            output.foodYield += foodYield
            output.productionYield += productionYield
            output.tradeYield += tradeYield
        })

        output.foodYield -= this.population*2

        return output
    }



    processTurn() {
        let notices = []

        this.foodStore += this.output.foodYield
        this.productionStore += this.output.productionYield

        if (this.foodStore < 0 && this.population > 1) {
            this.citizens.pop()
            notices.push(`Starvation in ${this.name}! Population reduced to ${this.population}.`)
        }

        if (this.foodStore >= this.foodStoreRequiredForGrowth) {
            this.citizens.push(new Citizen())
            this.foodStore = 0
            notices.push(`${this.name} has grown to a population of ${this.population}.`)
        }

        this.foodStore = Math.max(0, this.foodStore)
        return notices
    }

}


export { Town, citizenJobs }