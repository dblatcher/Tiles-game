import { Faction } from './Faction'
import { MapSquare } from './MapSquare'

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
    }

    get x() { return this.mapSquare.x}
    get y() { return this.mapSquare.y}
    get population() { return this.citizens.length}

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
        return output
    }
}


export { Town, citizenJobs }