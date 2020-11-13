import { TechDiscovery, techDiscoveries } from './TechDiscovery.tsx'

class BuildingType {
    name: string;
    displayName: string;
    productionCost: number;
    maintenanceCost: number;
    prerequisite: string | null;
    constructor(name, input: any = {}) {
        this.name = name
        this.displayName = input.displayName || name
        this.productionCost = input.productionCost || 50
        this.maintenanceCost = input.maintenanceCost || 0
        this.prerequisite = input.prerequisite || null
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

    get infoPageUrl() {return `/info/building/${this.name}`}
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
    }),
    library: new BuildingType('library', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'writing',
    }),
}

export { BuildingType, buildingTypes }