import { MapSquare } from './MapSquare.tsx'
import { terrainTypes } from './TerrainType.tsx'
import { unitTypes, Unit } from './Unit.tsx'
import { Faction } from './Faction.tsx'
import { Town } from './Town.tsx'

const makeGameState = {


    test() {
        const factions = [
            new Faction('Crimsonia', { color: 'crimson' }),
            new Faction('Azula', { color: 'blue' }),
        ]

        const units = [
            new Unit(unitTypes.worker, factions[0], { x: 2, y: 3 }),
            new Unit(unitTypes.worker, factions[0], { x: 5, y: 3 }),
            new Unit(unitTypes.knight, factions[0], { x: 5, y: 3 }),
            new Unit(unitTypes.knight, factions[0], { x: 3, y: 3 }),
            new Unit(unitTypes.spearman, factions[0], { x: 4, y: 3 }),
            new Unit(unitTypes.knight, factions[1], { x: 3, y: 5 }),
            new Unit(unitTypes.spearman, factions[1], { x: 3, y: 5 }),
            new Unit(unitTypes.worker, factions[1], { x: 3, y: 5 }),
        ]

        const towns = [
            new Town(factions[0], 2, 1, { name: "Jamestown", population:4 }),
            new Town(factions[0], 29, 16, { name: "Plymouth" }),
            new Town(factions[1], 5, 7, { name: "Montreal" }),
            new Town(factions[1], 4, 17, { name: "Quebec" }),
        ]

        return {
            mapGrid: MapSquare.makeGrid(30, 18, function (x, y) {
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

                const terrain = !inWater
                    ? 3 * y + x > 40
                        ? (y > 12)
                            ? terrainTypes.desert
                            : terrainTypes.grass
                        : x > 4
                            ? terrainTypes.swamp
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
            towns,
            activeFaction: factions[0],
            selectedUnit: units.filter(unit => unit.faction === factions[0])[0],
        }
    }


}

export default makeGameState