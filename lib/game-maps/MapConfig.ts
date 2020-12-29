
class LandFormOption {
    id: string;
    name: string;
    description: string;
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.description = input.description;
    }
    static get map() {
        let map = {}

        landFormOptions.forEach(landFormOption => {
            map[landFormOption.id] = landFormOption
        })

        return map
    }
}

const landFormOptions = [
    new LandFormOption({id:'CONTINENTS', name:'Continents', description:'Several continents separated by oceans' }),
    new LandFormOption({id:'PANGEA', name:'Pangea', description:'One huge landmass.' }),
]

class MapConfig {
    width: number
    height: number
    treeChance: number
    landFormOption: LandFormOption

    constructor(input) {
        this.width = input.width;
        this.height = input.height;
        this.treeChance = input.treeChance;
        this.landFormOption = landFormOptions.includes(input.landFormOption) ? input.landFormOption : landFormOptions[0]
    }
}

export { MapConfig, LandFormOption, landFormOptions }