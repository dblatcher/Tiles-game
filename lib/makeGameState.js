import { MapSquare } from './MapSquare.tsx'
import { terrainTypes } from './TerrainType.tsx'
import { unitTypes, Unit, Faction } from './Unit.tsx'

const makeGameState = {


    test() {
        const factions = [
            new Faction('Crimsonia', { color: 'crimson' }),
            new Faction('Azula', { color: 'blue' }),
        ]

        const units = [
            new Unit(unitTypes.knight, factions[0], { x: 5, y: 3 }),
            new Unit(unitTypes.worker, factions[0], { x: 2, y: 3 }),
            new Unit(unitTypes.knight, factions[0], { x: 3, y: 3 }),
            new Unit(unitTypes.spearman, factions[0], { x: 4, y: 3 }),
            new Unit(unitTypes.knight, factions[1], { x: 3, y: 5 }),
            new Unit(unitTypes.spearman, factions[1], { x: 3, y: 5 }),
            new Unit(unitTypes.worker, factions[1], { x: 3, y: 5 }),
        ]

        return {
            mapGrid: MapSquare.makeGrid(16, 16, function (x, y) {

                const inWater = !(x - y * 1.5 < 3) || y + 2.2 * x > 26 || (y == 10 && x == 2)

                const terrain = !inWater
                    ? 3 * y + x > 40
                        ? terrainTypes.swamp
                        : x > 4
                            ? terrainTypes.grass
                            : terrainTypes.plain
                    : terrainTypes.ocean;

                const tree = !inWater
                    ? x > 2 && y % x > 2 && y > 5
                    : false;

                const road = !inWater
                    ? x == 6 || y == 8 || x == 3
                    : false

                return new MapSquare({ terrain, tree, road }, x, y)
            }),
            factions,
            units,
            selectedSquare: null,
            selectedUnit: units.filter(unit => unit.faction === factions[0])[0],
            activeFaction: factions[0],
        }
    }


}

export default makeGameState