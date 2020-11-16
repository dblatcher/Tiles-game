import { TechDiscovery, techDiscoveries } from './TechDiscovery.tsx'

class BuildingType {
    name: string;
    displayName: string;
    productionCost: number;
    maintenanceCost: number;
    prerequisite: string | null;
    townRevenueMultiplierBonus: object | null;
    townRevenueAdditionBonus: object | null;
    constructor(name, input: any = {}) {
        this.name = name
        this.displayName = input.displayName || name
        this.productionCost = input.productionCost || 50
        this.maintenanceCost = input.maintenanceCost || 0
        this.prerequisite = input.prerequisite || null
        this.townRevenueMultiplierBonus = input.townRevenueMultiplierBonus || null
        this.townRevenueAdditionBonus = input.townRevenueAdditionBonus || null
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

    get infoPageUrl() {return `/info/building/${this.name.toLowerCase()}`}
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
        prerequisite:'currency',
        townRevenueMultiplierBonus : {
            treasury: .5
        },
    }),
    library: new BuildingType('library', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'writing',
        townRevenueMultiplierBonus : {
            research: .5
        }
    }),
    temple: new BuildingType('temple', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'ceremonialBurial',
        townRevenueAdditionBonus : {
            entertainment: 4
        }
    }),
    theatre: new BuildingType('theatre', {
        productionCost: 65,
        maintenanceCost: 2,
        prerequisite: 'construction',
        townRevenueAdditionBonus : {
            entertainment: 6
        }
    }),
}

export { BuildingType, buildingTypes }