import { ContinentSizes } from "./Continent";


class MapConfig {
    width:number
    height:number
    treeChance:number
    // continentSizes: ContinentSizes

    constructor(input) {
        this.width = input.width;
        this.height = input.height;
        this.treeChance = input.treeChance;
        // this.continentSizes = input.continentSizes || {}
    }
}

export {MapConfig}