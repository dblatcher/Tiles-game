import { MapSquare } from './game-entities/MapSquare.tsx'
import { terrainTypes } from './game-entities/TerrainType.tsx'
import { unitTypes, Unit } from './game-entities/Unit.tsx'
import { Faction, ComputerFaction } from './game-entities/Faction.tsx'
import { Town } from './game-entities/Town.tsx'
import { buildingTypes } from './game-entities/BuildingType.tsx'
import { techDiscoveries } from './game-entities/TechDiscovery.tsx'


const makeGameState = {

    blank() {
        const mapGrid = MapSquare.makeGrid(0, 0, (x, y) => null)
        const factions = []
        const units = []
        const towns = []

        return {
            mapGrid,
            factions,
            units,
            towns,
            activeFaction: null,
            selectedUnit: null,
        }

    },

    test() {

        const mapGrid = MapSquare.makeGrid(40, 40, function (x, y) {
            const inWater = (
                !(x - y * 1.5 < 3)
                || y + 2.2 * x > 26
                || (y == 10 && x == 2)
            ) && (
                    y != 14
                    && y != 12
                    && !(x == 9 && y == 1)
                    && !(x > 20)
                )

            let terrain = !inWater
                ? 3 * y + x > 40
                    ? (y > 12)
                        ? (x - y * 2) > 25 || x > 8
                            ? terrainTypes.desert
                            : terrainTypes.mountains
                        : terrainTypes.grass
                    : x > 4
                        ? terrainTypes.swamp
                        : terrainTypes.plain
                : terrainTypes.ocean;

            if (x == 4 && y==3) {
                terrain = terrainTypes.hills
            }

            const tree = !inWater && !terrain.neverTrees
                ? x > 2 && y % x > 2 && y > 5
                : false;

            const road = !inWater
                ? x == 6 || y == 8 || x == 3
                : false

            return new MapSquare({ terrain, tree, road }, x, y)
        })

        const factions = [
            new Faction('Crimsonia', { 
                color: 'crimson', 
                treasury: 100,
                researchGoal: techDiscoveries.bronzeWorking,
                knownTech:[techDiscoveries.alphabet, techDiscoveries.pottery, techDiscoveries.writing]
             }),
            new ComputerFaction('Azula', { color: 'blue' },{foo:'bar'}),
        ]

        const units = [
            new Unit(unitTypes.warrior, factions[0], { x: 1, y: 3, vetran: true }),
            new Unit(unitTypes.worker, factions[0], { x: 2, y: 0 }),
            new Unit(unitTypes.explorer, factions[0], { x: 4, y: 2 }),
            new Unit(unitTypes.settler, factions[0], { x: 9, y: 12 }),
            // new Unit(unitTypes.swordsman, factions[1], { x: 6, y: 5 }),
            new Unit(unitTypes.spearman, factions[1], { x: 4, y: 8 }),
            new Unit(unitTypes.horseman, factions[1], { x: 5, y: 8 }),
            new Unit(unitTypes.settler, factions[1], { x: 5, y: 8 }),
        ]

        const towns = [
            new Town(factions[0], mapGrid[1][2], { 
                name: "Jamestown", 
                population: 4, 
                supportedUnits: [
                    // units[1], units[0]
                ],
                buildings: [buildingTypes.granary],
                foodStore: 60,
            }),
            new Town(factions[0], mapGrid[3][6], { 
                name: "Providence", 
                population: 8, 
                supportedUnits: [],
                productionStore: 30,
                isProducing: buildingTypes.marketplace,
                buildings: [buildingTypes.harbour],
            }),
            new Town(factions[0], mapGrid[16][29], { 
                name: "Plymouth" 
            }),
            new Town(factions[1], mapGrid[8][6], { 
                name: "Montreal", 
                population: 2, 
                supportedUnits: [] 
            }),
            // new Town(factions[1], mapGrid[11][2], { 
            //     name: "Quebec" 
            // }),
        ]

        return {
            mapGrid,
            factions,
            units,
            towns,
            activeFaction: factions[0],
            selectedUnit: units.filter(unit => unit.faction === factions[0])[0],
        }
    },


    randomWorld() {

        const mapWidth = 20, mapHeight = 20

        const mapGrid = MapSquare.makeRandomGrid(mapWidth, mapHeight, .3, 0)

        let possibleStartingPoints = []
        mapGrid.forEach(row => {
            possibleStartingPoints.push(...row.filter(mapSquare => !mapSquare.isWater))
        })

        const factions = [
            new Faction('Crimsonia', { color: 'crimson' }),
            new ComputerFaction('Azula', { color: 'blue' },{}),
            new ComputerFaction('Veridano', { color: 'green' },{}),
            // new Faction('Indigoo', { color: 'purple' }),
        ]

        const units = [
        ]

        const findDistance = (squareA, squareB) => Math.abs(squareA.x - squareB.x) + Math.abs(squareA.y - squareB.y)

        factions.forEach(faction => {
            let startingPoint = possibleStartingPoints[Math.floor(Math.random() * possibleStartingPoints.length)]

            possibleStartingPoints = possibleStartingPoints
                .filter(square => findDistance(square, startingPoint) > 4)

            units.push(new Unit(unitTypes.warrior, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.settler, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.explorer, faction, { x: startingPoint.x, y: startingPoint.y }))
        })


        return {
            mapGrid,
            factions,
            units,
            towns: [],
            activeFaction: factions[0],
            selectedUnit: units.filter(unit => unit.faction === factions[0])[0],
        }

    }

}

export default makeGameState