import { spriteSheets } from '../SpriteSheet.ts'

class CitizenJob {
    name: string;
    spriteFrameName: string;
    spriteSheetName: string;
    revenueAdditionBonus: any;
    constructor(name, config: any = {}) {
        this.name = name
        this.spriteFrameName = config.spriteFrameName || name;
        this.spriteSheetName = config.spriteSheetName || 'units';
        this.revenueAdditionBonus = config.revenueAdditionBonus || {}
    }
    get spriteStyle() {
        return spriteSheets[this.spriteSheetName].getStyleForFrameCalled(this.spriteFrameName)
    }
}

const citizenJobs = {
    entertainer: new CitizenJob('entertainer', {
        revenueAdditionBonus: { entertainment: 4 },
        spriteSheetName: 'units2',
    }),
    scientist: new CitizenJob('scientist', {
        revenueAdditionBonus: { research: 4 },
    }),
    merchant: new CitizenJob('merchant', {
        revenueAdditionBonus: { treasury: 4 },
        spriteFrameName: 'caravan',
        spriteSheetName: 'units2'

    }),
    worker: new CitizenJob('worker'),
}

export { CitizenJob, citizenJobs }