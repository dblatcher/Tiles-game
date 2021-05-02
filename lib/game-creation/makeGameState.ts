import { MapSquare } from '../game-entities/MapSquare'
import { TerrainType, terrainTypes } from '../game-entities/TerrainType'
import { unitTypes } from '../game-entities/UnitType'
import { Unit } from '../game-entities/Unit'
import { Faction, ComputerFaction } from '../game-entities/Faction'
import { OnGoingOrder, orderTypesMap } from '../game-entities/OngoingOrder'
import { Town } from '../game-entities/Town'
import { buildingTypes } from '../game-entities/BuildingType'
import { techDiscoveries } from '../game-entities/TechDiscovery'

import townNames from './townNames'
import { makeMap } from '../game-maps/makeMap'
import { MapConfig } from '../game-maps/MapConfig'
import { UnitMission } from '../game-ai/UnitMission'

import { TutorialState } from '../game-misc/tutorial'

import { makeStandardFactions } from './factionFactory'
import { assignStartingPoints, findStartingPoints } from './findStartingPoints'
import { InitialGameState } from '../game-entities/GameState'
import { Village } from '../game-entities/Village'

class WorldConfig {
    numberOfFactions?: number
    tutorialEnabled?: boolean
}

const makeGameStateFunction = {

    blank: () => () => {
        return new InitialGameState()
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
                }),
        ]

        const units = [
            // new Unit(unitTypes.dragoon, factions[0], { x: 5, y: 2, vetran: true }),
            // new Unit(unitTypes.warrior, factions[1], { x: 4, y: 2, vetran: false }),
            // new Unit(unitTypes.settler, factions[1], { x: 25, y: 1 }),
            // new Unit(unitTypes.worker, factions[0], { x: 3, y: 10 }),
            // new Unit(unitTypes.settler, factions[0], { x: 14, y: 12 }),
            // new Unit(unitTypes.worker, factions[1], { x: 4, y: 4 }),
            new Unit(unitTypes.spearman, factions[1], {
                x: 1, y: 2,
                onGoingOrder: new OnGoingOrder(orderTypesMap['Fortified'])
            }),
            // new Unit(unitTypes.horseman, factions[1], {
            //     x: 3, y: 11,
            // }),
            // new Unit(unitTypes.explorer, factions[1], { x: 26, y: 13 }),
            // new Unit(unitTypes.settler, factions[1], { x: 5, y: 8 }),
            // new Unit(unitTypes.trireme, factions[0], { x: 5, y: 1 }),
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

        const initialState = new InitialGameState()
        initialState.mapGrid = mapGrid;
        initialState.factions = factions;
        initialState.units = units;
        initialState.towns = towns;
        initialState.activeFaction = factions[0];
        initialState.selectedUnit = units.find(unit => unit.faction === factions[0]);
        initialState.turnNumber = 142;
        initialState.tutorial = new TutorialState(true, factions[0])

        return initialState
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
        mapGrid[5][4].terrain = terrainTypes.hills

        mapGrid[7][9].terrain = terrainTypes.ocean
        mapGrid[6][9].terrain = terrainTypes.ocean
        mapGrid[5][9].terrain = terrainTypes.ocean
        mapGrid[5][10].terrain = terrainTypes.ocean
        mapGrid[5][11].terrain = terrainTypes.ocean
        mapGrid[7][10].terrain = terrainTypes.ocean

        mapGrid[4][4].mine = true
        mapGrid[5][4].mine = true

        for (let i = 0; i < mapGrid[0].length; i++) {
            mapGrid[4][i].road = true;
            mapGrid[3][i].road = true;
        }

        const factions = [
            new Faction('Crimsonia', {
                color: 'crimson',
                treasury: 100,
                research: 37,
                researchGoal: techDiscoveries.leadership,
                knownTech: [techDiscoveries.alphabet, techDiscoveries.pottery, techDiscoveries.writing, techDiscoveries.astronomy, techDiscoveries.banking, techDiscoveries.chivalry],
                townNames: townNames.cambodia,
            }),
            new ComputerFaction('Azula', {
                color: 'blue',
                treasury: 100,
                townNames: townNames.peru,
                knownTech: [techDiscoveries.ironWorking, techDiscoveries.bronzeWorking, techDiscoveries.alphabet, techDiscoveries.horsebackRiding],
            },
                {
                    minimumTownLocationScore: 30,
                    defendersPerTown: 1,
                    conquerPriority: 4,
                    expandPriority: 1,
                    developPriority: 1,
                    discoverPriority: 1,
                }
            ),
        ]


        const bunchOfEnemyWarriors = [
            new Unit(unitTypes.warrior, factions[1], { x: 18, y: 3 }),
            new Unit(unitTypes.warrior, factions[1], { x: 18, y: 4 }),
            new Unit(unitTypes.warrior, factions[1], { x: 18, y: 5 }),
            new Unit(unitTypes.warrior, factions[1], { x: 18, y: 6 }),
        ]

        const units = [
            new Unit(unitTypes.musketeer, factions[0], { x: 3, y: 3, vetran: true }),
            new Unit(unitTypes.settler, factions[0], { x: 3, y: 3, vetran: true }),
            new Unit(unitTypes.horseman, factions[0], { x: 8, y: 3, vetran: true }),
            ...bunchOfEnemyWarriors,
            new Unit(unitTypes.settler, factions[1], {
                x: 5, y: 4, vetran: true, missions: [
                ]
            }),
            new Unit(unitTypes.spearman, factions[1], {
                x: 6, y: 2, vetran: true, onGoingOrder: new OnGoingOrder(orderTypesMap['Fortified'])
            }),
            // new Unit(unitTypes.dragoon, factions[2], { x: 2, y: 5, vetran: true }),
        ]

        const towns = [
            new Town(factions[1], mapGrid[3][1], {
                name: "Jamestown",
                population: 10,
                supportedUnits: bunchOfEnemyWarriors,
                buildings: [buildingTypes.granary],
                foodStore: 60,
            }),
            new Town(factions[0], mapGrid[2][5], {
                population: 2,
                productionStore: 10,
                foodStore: 22,
            }),
            new Town(factions[0], mapGrid[1][10], {
                population: 10,
                productionStore: 17,
            }),
            new Town(factions[0], mapGrid[6][10], {
                population: 10,
                productionStore: 17,
            }),
            new Town(factions[0], mapGrid[9][9], {
                population: 4,
                productionStore: 17,
            }),
        ]

        const villages = [
            new Village(mapGrid[1][1],{})
        ]

        const initialState = new InitialGameState()
        initialState.mapGrid = mapGrid;
        initialState.factions = factions;
        initialState.units = units;
        initialState.towns = towns;
        initialState.villages = villages;
        initialState.activeFaction = factions[0];
        initialState.selectedUnit = units.find(unit => unit.faction === factions[0]);
        initialState.turnNumber = 33;

        return initialState
    },


    randomWorld: (mapConfigInput: MapConfig, worldConfig: WorldConfig = {}) => () => {
        const { numberOfFactions = 2 } = worldConfig

        const factions = makeStandardFactions(numberOfFactions)
        const units: Unit[] = []
        const mapGrid = makeMap(new MapConfig(mapConfigInput));

        let possibleStartingPoints = findStartingPoints(mapGrid)
        let startingPoints = assignStartingPoints(factions, possibleStartingPoints)

        factions.forEach((faction, index) => {
            const startingPoint = startingPoints[index]
            if (!startingPoint) { return }

            units.push(new Unit(unitTypes.warrior, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.settler, faction, { x: startingPoint.x, y: startingPoint.y }))
            units.push(new Unit(unitTypes.worker, faction, { x: startingPoint.x, y: startingPoint.y }))
        })

        const initialState = new InitialGameState()
        initialState.mapGrid = mapGrid;
        initialState.factions = factions;
        initialState.units = units;
        initialState.towns = [];
        initialState.activeFaction = factions[0];
        initialState.selectedUnit = units.find(unit => unit.faction === factions[0]);
        initialState.turnNumber = 1;
        initialState.tutorial = worldConfig.tutorialEnabled ? new TutorialState(true, factions[0]) : null

        return initialState
    }
}

export default makeGameStateFunction