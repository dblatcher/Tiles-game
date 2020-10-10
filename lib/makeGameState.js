import { MapSquare } from './MapSquare.tsx'
import { terrainTypes } from './TerrainType.tsx'
import { unitTypes, Unit, Faction } from './Unit.tsx'

const makeGameState = {


    test() {
        const factions = [
            new Faction('Crimsonia', { color: 'crimson' }),
            new Faction('Azula', { color: 'blue' }),
        ]

        return {
            mapGrid: MapSquare.makeGrid(16, 16, function (x, y) {

                const terrain = y > 5
                    ? terrainTypes.swamp
                    : x > 4
                        ? terrainTypes.desert
                        : terrainTypes.plain;

                return new MapSquare({
                    terrain,
                    tree: x > 2 && y % x != 2,
                    road: x == 6 || y == 8,
                }, x, y)
            }),
            selectedSquare: null,
            units: [
                new Unit(unitTypes.worker, factions[0], { x: 2, y: 3 }),
                new Unit(unitTypes.knight, factions[0], { x: 3, y: 3 }),
                new Unit(unitTypes.spearman, factions[0], { x: 4, y: 3 }),
                new Unit(unitTypes.knight, factions[0], { x: 5, y: 3 }),
                new Unit(unitTypes.knight, factions[1], { x: 3, y: 5 }),
                new Unit(unitTypes.spearman, factions[1], { x: 3, y: 5 }),
                new Unit(unitTypes.worker, factions[1], { x: 3, y: 5 }),
            ],
            selectedUnit: null,
            factions,
            activeFaction: factions[0],
        }
    }


}

export default makeGameState