import { spriteSheets } from '../SpriteSheet.tsx'

class CitizenJob {
    name: string;
    spriteFrameName: string;
    spriteSheetName: string;
    constructor(name, config:any={}) {
        this.name = name
        this.spriteFrameName = config.spriteFrameName || name;
        this.spriteSheetName = config.spriteSheetName || 'units';
    }
    get spriteStyle() {
        return spriteSheets[this.spriteSheetName].getStyleForFrameCalled(this.spriteFrameName)
    }
}

const citizenJobs = {
    unemployed: new CitizenJob('unemployed'),
    worker: new CitizenJob('worker'),
}

export { CitizenJob, citizenJobs }