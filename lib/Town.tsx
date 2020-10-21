import { Faction } from './Faction'
import { MapSquare} from './MapSquare'

let townIndex = 0

class CitizenJob {
    name:string;
    constructor(name) {
        this.name = name
    }
}

const citizenJobs = {
    unemployed: new CitizenJob('unemployed'),
    worker: new CitizenJob('worker'),
}

class Citizen {
    mapSquare: MapSquare|null;
    job:CitizenJob|null;

    constructor() {
        this.mapSquare = null
        this.job = citizenJobs.unemployed
    }

    putToWorkInSquare(mapSquare:MapSquare) {
        this.mapSquare = mapSquare
        this.job = citizenJobs.worker
    }

    makeUnemployed() {
        this.mapSquare = null
        this.job = citizenJobs.unemployed
    }
}

class Town {
    faction: Faction;
    x: number;
    y: number;
    indexNumber: number;
    name: string;
    foodStore: number;
    citizens: Array<Citizen>;
    constructor(faction: Faction, x: number, y: number, config: object = {}) {
        this.faction = faction;
        this.x = x
        this.y = y
        this.indexNumber = ++townIndex

        this.name = config.name || `TOWN#${townIndex}-${faction.name}`
        
        const population = config.population || 1
        this.citizens = []
        
        for (let i=0; i<population; i++){
            this.citizens.push(new Citizen())
        }
        

        this.foodStore = config.foodStore || 0
    }

    get population() {
        return this.citizens.length
    }
}


export { Town, citizenJobs }