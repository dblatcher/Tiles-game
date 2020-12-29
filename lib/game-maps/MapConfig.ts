

class MapConfig {
    width:number
    height:number
    treeChance:number

    constructor(input) {
        this.width = input.width;
        this.height = input.height;
        this.treeChance = input.treeChance;
    }
}

export {MapConfig}