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

export { CitizenJob, citizenJobs }