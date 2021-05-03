
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
    new LandFormOption({ id: 'CONTINENTS', name: 'Continents', description: 'Several continents separated by oceans' }),
    new LandFormOption({ id: 'PANGEA', name: 'Pangea', description: 'One huge landmass.' }),
    new LandFormOption({ id: 'HEMISPHERES', name: 'Hemisphere', description: 'Two big continents' }),
]

class MapConfig {
    width: number
    height: number
    treeChance: number
    landFormOption?: LandFormOption
    villageRate?: number

    constructor(input) {
        this.width = input.width;
        this.height = input.height;
        this.treeChance = input.treeChance;
        this.landFormOption = landFormOptions.includes(input.landFormOption) ? input.landFormOption : landFormOptions[0]
        this.villageRate = typeof input.villageRate == 'number'
            ? input.villageRate
            : .1
    }

    static get rangeValues() {
        return {
            villageRate: { min: 0, max: .25, step: .05 },
            treeChance: { min: 0, max: 1, step: .05 },
            width: { min: 20, max: 80 },
            height: { min: 15, max: 50 },
        }
    }
}

export { MapConfig, LandFormOption, landFormOptions }