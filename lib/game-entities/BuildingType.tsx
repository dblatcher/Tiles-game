class BuildingType {
    name: string;
    productionCost: number;
    maintenanceCost: number;
    constructor(name, input: any = {}) {
        this.name = name
        this.productionCost = input.productionCost || 50
        this.maintenanceCost = input.maintenanceCost || 0
    }
    get classIs() { return 'BuildingType' }
}

const buildingTypes = {
    granary: new BuildingType('granary', {
        productionCost: 60,
        maintenanceCost: 1,
    }),
    barracks: new BuildingType('barracks', {
        productionCost: 20,
        maintenanceCost: 1,
    }),
}

export { BuildingType, buildingTypes }