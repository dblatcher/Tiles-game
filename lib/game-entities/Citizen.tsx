import { MapSquare } from './MapSquare'
import { CitizenJob, citizenJobs } from './CitizenJob.tsx'

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

    get serialised() {
        let output = {
            mapSquare: this.mapSquare ? {x: this.mapSquare.x, y: this.mapSquare.y} : null,
            job: this.job ? this.job.name : null,
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data, mapGrid) {
        const mapSquare = data.mapSquare ? mapGrid[data.mapSquare.y][data.mapSquare.x] : undefined
        const job = data.job ? citizenJobs[data.job] : undefined
        return new Citizen(mapSquare, job)
    }
}

export { Citizen }