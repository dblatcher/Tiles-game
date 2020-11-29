import { MapSquare } from './MapSquare'
import { Town } from './Town'

import { CitizenJob, citizenJobs } from './CitizenJob.tsx'

class Citizen {
    mapSquare: MapSquare | null;
    job: CitizenJob | null;

    constructor(mapSquare = null, job = citizenJobs.entertainer) {
        this.mapSquare = mapSquare
        this.job = job
    }

    putToWorkInSquare(mapSquare: MapSquare) {
        this.mapSquare = mapSquare
        this.job = citizenJobs.worker
    }

    changeJob() {
        if (this.job == citizenJobs.worker) {
            this.mapSquare = null
            this.job = citizenJobs.entertainer
        } else {
            let nonWorkerJobs = []
            for (let jobName in citizenJobs) {
                if (jobName !== 'worker') { nonWorkerJobs.push(citizenJobs[jobName]) }
            }
            this.job = nonWorkerJobs[nonWorkerJobs.indexOf(this.job) + 1] || nonWorkerJobs[0]
        }
    }

    getOutput(town: Town) {
        if (this.mapSquare) {

            let output = {
                foodYield: this.mapSquare.foodYield,
                tradeYield: this.mapSquare.tradeYield,
                productionYield: this.mapSquare.productionYield,
            }
            town.buildings.forEach(buildingType => {
                if (buildingType.addSquareOutputBonus) {
                    buildingType.addSquareOutputBonus(this.mapSquare, output)
                }
            })
            return output
        }

        return {}
    }

    get serialised() {
        let output = {
            mapSquare: this.mapSquare ? { x: this.mapSquare.x, y: this.mapSquare.y } : null,
            job: this.job ? this.job.name : null,
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data, mapGrid:Array<Array<MapSquare>>) {
        const mapSquare = data.mapSquare ? mapGrid[data.mapSquare.y][data.mapSquare.x] : undefined
        const job = data.job ? citizenJobs[data.job] : undefined
        return new Citizen(mapSquare, job)
    }
}

export { Citizen }