import { MapSquare } from './MapSquare';
import { TechDiscovery, techDiscoveries } from './TechDiscovery'
import { camelToSentence } from '../utility';
import { Town } from './Town';
import { BASE_POPULATION_LIMIT } from '../game-logic/constants';
import { GameState } from './GameState';

interface BuildingIsUsefulFunction {
    (town: Town, state: GameState): { boolean }
}

class BuildingType {
    name: string;
    displayName: string;
    productionCost: number;
    maintenanceCost: number;
    prerequisite: string | null;
    revenueMultiplierBonus: object | null;
    reduceUnhappiness: number;
    addSquareOutputBonus: Function | null;
    allowExtraPopulation: number;
    aiPriority: "EXPAND" | "DEVELOP" | "DISCOVER" | "CONQUER"
    specialCaseIsUsefulFunction: BuildingIsUsefulFunction;
    constructor(name, input: any = {}) {
        this.name = name
        this.displayName = input.displayName || camelToSentence(name)
        this.productionCost = input.productionCost || 50
        this.maintenanceCost = input.maintenanceCost || 0
        this.prerequisite = input.prerequisite || null
        this.revenueMultiplierBonus = input.revenueMultiplierBonus || null
        this.reduceUnhappiness = input.reduceUnhappiness || 0
        this.allowExtraPopulation = input.allowExtraPopulation || 0
        this.addSquareOutputBonus = input.addSquareOutputBonus || null
        this.specialCaseIsUsefulFunction = input.specialCaseIsUsefulFunction || null
        this.aiPriority = input.aiPriority || "DEVELOP"
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

    checkIfUsefulFor(town: Town, state: GameState) {

        if (this.specialCaseIsUsefulFunction) { return this.specialCaseIsUsefulFunction(town, state) }

        if (this.revenueMultiplierBonus) { return town.population >= 1 + 3 * (this.maintenanceCost - 1) }

        if (this.reduceUnhappiness) {
            let unhappinessReductionFromExistingBuildings = town.buildings
                .reduce((accumulator, buildingType) => accumulator + buildingType.reduceUnhappiness, 0)
            return town.baseUnhappiness - unhappinessReductionFromExistingBuildings > 0
        }

        if (this.allowExtraPopulation) {
            return town.population >= BASE_POPULATION_LIMIT
        }

        return true
    }

    get infoPageUrl() { return `/info/building/${this.name.toLowerCase()}` }
}

const buildingTypes = {
    granary: new BuildingType('granary', {
        productionCost: 60,
        maintenanceCost: 1,
        prerequisite: 'pottery',
        aiPriority: 'EXPAND',
        // rule is special cased
    }),
    barracks: new BuildingType('barracks', {
        productionCost: 20,
        maintenanceCost: 1,
        aiPriority: "CONQUER",
        // rule is special cased
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
            if (mapSquare.isWater) { output.foodYield += 1 }
        },

        specialCaseIsUsefulFunction(town:Town, state:GameState) {
            const squaresAroundTown = town.getSquaresAndObstacles(state.mapGrid, state.towns, state.units).squares as MapSquare[]
            return squaresAroundTown.some(mapSquare => mapSquare.isWater)
        }
    }),
    library: new BuildingType('library', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'writing',
        revenueMultiplierBonus: {
            research: .5
        },
        aiPriority: "DISCOVER",
    }),
    temple: new BuildingType('temple', {
        productionCost: 40,
        maintenanceCost: 1,
        prerequisite: 'ceremonialBurial',
        reduceUnhappiness: 2,
    }),
    theatre: new BuildingType('theatre', {
        productionCost: 65,
        maintenanceCost: 2,
        prerequisite: 'construction',
        reduceUnhappiness: 3,
    }),
    cityWalls: new BuildingType('cityWalls', {
        productionCost: 50,
        maintenanceCost: 2,
        prerequisite: 'masonry',
        aiPriority: "CONQUER",
        // rule special cased
        specialCaseIsUsefulFunction(town, state) {
            return town.population >= 2
        }
    }),
    courtHouse: new BuildingType('courtHouse', {
        productionCost: 30,
        maintenanceCost: 1,
        prerequisite: 'codeOfLaws',
        // TO DO : corruption rule
        specialCaseIsUsefulFunction(town, state) {
            return false
        }
    }),
    aqueduct: new BuildingType('aqueduct', {
        productionCost: 50,
        maintenanceCost: 1,
        prerequisite: 'construction',
        allowExtraPopulation: 4,
        aiPriority: 'EXPAND',
    }),
    university: new BuildingType('university', {
        productionCost: 60,
        maintenanceCost: 2,
        prerequisite: 'university',
        revenueMultiplierBonus: {
            research: .5
        },
        aiPriority: "DISCOVER",
    }),
    bank: new BuildingType('bank', {
        productionCost: 60,
        maintenanceCost: 2,
        prerequisite: 'banking',
        revenueMultiplierBonus: {
            treasury: 1
        }
    }),
    cathedral: new BuildingType('cathedral', {
        productionCost: 80,
        maintenanceCost: 3,
        prerequisite: 'monotheism',
        reduceUnhappiness: 4
    }),
}

export { BuildingType, buildingTypes }