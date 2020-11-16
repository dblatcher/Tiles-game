import { MapSquare } from './MapSquare';
import { TechDiscovery, techDiscoveries } from './TechDiscovery.tsx'

class BuildingType {
    name: string;
    displayName: string;
    productionCost: number;
    maintenanceCost: number;
    prerequisite: string | null;
    revenueMultiplierBonus: object | null;
    revenueAdditionBonus: object | null;
    addSquareOutputBonus: Function | null;
    constructor(name, input: any = {}) {
        this.name = name
        this.displayName = input.displayName || name
        this.productionCost = input.productionCost || 50
        this.maintenanceCost = input.maintenanceCost || 0
        this.prerequisite = input.prerequisite || null
        this.revenueMultiplierBonus = input.revenueMultiplierBonus || null
        this.revenueAdditionBonus = input.revenueAdditionBonus || null
        this.addSquareOutputBonus = input.addSquareOutputBonus || null
    }
    get classIs() { return 'BuildingType' }

    checkCanBuildWith(knowTech: Array<TechDiscovery>) {
        if (!this.prerequisite) { return true }
        if (!techDiscoveries[this.prerequisite]) {
            console.warn(`Tech prerequisite[${this.prerequisite}] for BuildingType ${this.name} does not exist.`)
            return true
        }
        return knowTech.includes(techDiscoveries[this.prerequisite])
    }

    get infoPageUrl() { return `/info/building/${this.name.toLowerCase()}` }
}

const buildingTypes = {
    granary: new BuildingType('granary', {
        productionCost: 60,
        maintenanceCost: 1,
        prerequisite: 'pottery',
    }),
    barracks: new BuildingType('barracks', {
        productionCost: 20,
        maintenanceCost: 1,
    }),
    marketplace: new BuildingType('marketplace', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'currency',
        revenueMultiplierBonus: {
            treasury: .5
        },
    }),
    harbour: new BuildingType('harbour', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'seafaring',

        addSquareOutputBonus: (mapSquare, output) => {
            if (mapSquare.isWater) { output.foodYield += 1}
        },

    }),
    library: new BuildingType('library', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'writing',
        revenueMultiplierBonus: {
            research: .5
        }
    }),
    temple: new BuildingType('temple', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'ceremonialBurial',
        revenueAdditionBonus: {
            entertainment: 4
        }
    }),
    theatre: new BuildingType('theatre', {
        productionCost: 65,
        maintenanceCost: 2,
        prerequisite: 'construction',
        revenueAdditionBonus: {
            entertainment: 6
        }
    }),
}

export { BuildingType, buildingTypes }