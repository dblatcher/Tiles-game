import { Faction } from './Faction'

let townIndex = 0

class Town {
    faction: Faction;
    x: number;
    y: number;
    indexNumber: number;
    name: string;
    population: number;
    constructor(faction: Faction, x: number, y: number, config: object = {}) {
        this.faction = faction;
        this.x = x
        this.y = y
        this.indexNumber = ++townIndex

        this.name = config.name || `TOWN#${townIndex}-${faction.name}`
        this.population = config.population || 1
    }
}


export { Town }