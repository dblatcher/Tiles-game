import { MapSquare } from './game-entities/MapSquare'
import { TerrainType, terrainTypes } from './game-entities/TerrainType'
import { unitTypes } from './game-entities/UnitType'
import { Unit } from './game-entities/Unit'
import { Faction, ComputerFaction } from './game-entities/Faction'
import { OnGoingOrder, orderTypesMap } from './game-entities/OngoingOrder'
import { Town } from './game-entities/Town'
import { buildingTypes } from './game-entities/BuildingType'
import { techDiscoveries } from './game-entities/TechDiscovery'

import townNames from './game-entities/townNames'
import { makeMap } from './game-maps/makeMap.ts'
import { MapConfig } from './game-maps/MapConfig.ts'
import { UnitMission } from './game-ai/UnitMission'



const makeGameStateFunction = {

    blank: () => () => {
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

    test: () => () => {

        const mapGrid = MapSquare.makeGrid(40, 30, function (x, y) {
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
                    : x > 6
                        ? terrainTypes.arctic
                        : terrainTypes.plain
                : terrainTypes.ocean;

            if (x == 4 && y == 3) {
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
                knownTech: [techDiscoveries.alphabet, techDiscoveries.pottery, techDiscoveries.writing],
                townNames: townNames.cambodia,
            }),
            new ComputerFaction('Azula', {
                color: 'blue',
                treasury: 100,
                townNames: townNames.peru,
                knownTech: [techDiscoveries.alphabet, techDiscoveries.bronzeWorking, techDiscoveries.masonry],
            },
                {
                    foo: 'bar'
                }),
        ]

        const units = [
            new Unit(unitTypes.dragoon, factions[0], { x: 5, y: 2, vetran: true }),
            new Unit(unitTypes.warrior, factions[1], { x: 4, y: 2, vetran: false }),
            new Unit(unitTypes.settler, factions[1], { x: 25, y: 1 }),
            new Unit(unitTypes.worker, factions[0], { x: 3, y: 10 }),
            new Unit(unitTypes.settler, factions[0], { x: 14, y: 12 }),
            new Unit(unitTypes.worker, factions[1], { x: 4, y: 4 }),
            new Unit(unitTypes.spearman, factions[1], {
                x: 1, y: 11,
                onGoingOrder: new OnGoingOrder(orderTypesMap['Fortified'], 4)
            }),
            new Unit(unitTypes.horseman, factions[1], {
                x: 3, y: 11,
            }),
            new Unit(unitTypes.explorer, factions[1], { x: 26, y: 13 }),
            new Unit(unitTypes.settler, factions[1], { x: 5, y: 8 }),
            new Unit(unitTypes.trireme, factions[0], { x: 5, y: 1 }),
        ]

        const towns = [
            new Town(factions[0], mapGrid[1][2], {
                name: "Jamestown",
                population: 6,
                supportedUnits: [
                    // units[1], units[0]
                ],
                buildings: [buildingTypes.harbour],
                foodStore: 68,
            }),
            new Town(factions[1], mapGrid[3][6], {
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
            new Town(factions[1], mapGrid[11][2], {
                name: "Quebec",
                buildings: [buildingTypes.cityWalls],
            }),
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

    test2: () => () => {

        const mapGrid = MapSquare.makeGridOf(20, 10, { terrain: terrainTypes.plain })

        mapGrid[0][0].terrain = terrainTypes.grass
        mapGrid[2][0].terrain = terrainTypes.grass
        mapGrid[4][0].terrain = terrainTypes.grass
        mapGrid[6][0].terrain = terrainTypes.grass
        mapGrid[8][0].terrain = terrainTypes.grass

        mapGrid[1][4].terrain = terrainTypes.mountains
        mapGrid[2][4].terrain = terrainTypes.mountains
        mapGrid[3][4].terrain = terrainTypes.mountains
        mapGrid[4][4].terrain = terrainTypes.mountains
        mapGrid[5][4].terrain = terrainTypes.mountains


        const factions = [
            new Faction('Crimsonia', {
                color: 'crimson',
                treasury: 100,
                researchGoal: techDiscoveries.bronzeWorking,
                knownTech: [techDiscoveries.alphabet, techDiscoveries.pottery, techDiscoveries.writing, techDiscoveries.astronomy, techDiscoveries.banking, techDiscoveries.chivalry],
                townNames: townNames.cambodia,
            }),
            new ComputerFaction('Azula', {
                color: 'blue',
                treasury: 100,
                townNames: townNames.peru,
                knownTech: [techDiscoveries.ironWorking, techDiscoveries.bronzeWorking, techDiscoveries.masonry, techDiscoveries.horsebackRiding],
            },
                {
                    foo: 'bar',
                    minimumTownLocationScore: 30,
                    defendersPerTown: 0
                }
            ),
        ]

        const units = [
            new Unit(unitTypes.musketeer, factions[0], { x: 3, y: 3, vetran: true }),
            new Unit(unitTypes.musketeer, factions[0], { x: 8, y: 3, vetran: true }),
            new Unit(unitTypes.swordsman, factions[1], {
                x: 5, y: 4, vetran: true, missions: [
                    new UnitMission('DEFEND_TOWN_AT', { target: { x: 8, y: 5 } })
                ]
            }),
            // new Unit(unitTypes.dragoon, factions[2], { x: 2, y: 5, vetran: true }),
        ]

        const towns = [
            // new Town(factions[0], mapGrid[1][2], {
            //     name: "Jamestown",
            //     population: 28,
            //     supportedUnits: [
            //         // units[1], units[0]
            //     ],
            //     buildings: [buildingTypes.granary],
            //     foodStore: 60,
            // }),
            // new Town(factions[1], mapGrid[4][3], {
            //     population: 1,
            //     productionStore:10,
            // }),
            new Town(factions[1], mapGrid[5][8], {
                population: 5,
                productionStore:17,
            }),
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


    randomWorld: (mapConfigInput) => () => {

        const mapGrid = makeMap(new MapConfig(mapConfigInput));

        let possibleStartingPoints = []
        mapGrid.forEach(row => {
            possibleStartingPoints.push(...row.filter(mapSquare => {
                return !mapSquare.isWater &&
                    mapSquare.terrain !== terrainTypes.arctic &&
                    mapSquare.terrain !== terrainTypes.tundra &&
                    mapSquare.terrain !== terrainTypes.mountains
            }))
        })

        let startingPointsAwayFromOtherPlayers = [].concat(possibleStartingPoints)

        const factions = [
            new Faction('Montenegro', { color: 'crimson', townNames: townNames.montenegro }),
            new ComputerFaction('Cambodia', { color: 'blue', townNames: townNames.cambodia }, {}),
            new ComputerFaction('Wisconsin', { color: 'green', townNames: townNames.wisconsin }, {}),
            new ComputerFaction('Peru', { color: 'purple', townNames: townNames.peru }, {}),
        ]

        const units = [
        ]

        const findDistance = (squareA, squareB) => Math.abs(squareA.x - squareB.x) + Math.abs(squareA.y - squareB.y)

        factions.forEach(faction => {
            let startingPoint
            if (possibleStartingPoints.length < 1) {
                console.warn('NO STARTING possible POINT FOR:', faction)
                return false
            } else if (startingPointsAwayFromOtherPlayers.length < 1) {
                console.warn('NO STARTING POINT AWAY FROM OTHER PLAYER FOR:', faction)
                startingPoint = possibleStartingPoints[Math.floor(Math.random() * possibleStartingPoints.length)]
            } else {
                startingPoint = startingPointsAwayFromOtherPlayers[Math.floor(Math.random() * startingPointsAwayFromOtherPlayers.length)]
            }

            possibleStartingPoints.splice(possibleStartingPoints.indexOf(startingPoint, 1))
            startingPointsAwayFromOtherPlayers = startingPointsAwayFromOtherPlayers
                .filter(square => findDistance(square, startingPoint) > 8)

            units.push(new Unit(unitTypes.warrior, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.settler, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.worker, faction, { x: startingPoint.x, y: startingPoint.y }))
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

export default makeGameStateFunction