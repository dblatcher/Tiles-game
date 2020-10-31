import { terrainTypes } from './TerrainType.tsx'
import { TerrainType, randomTerrainType } from './TerrainType.tsx'

class MapSquare {
    terrain: TerrainType
    road: boolean
    tree: boolean
    x: number
    y: number
    constructor(input, x, y) {
        this.terrain = input.terrain
        this.road = !!input.road
        this.tree = !!input.tree

        this.x = x
        this.y = y
    }

    get css() {
        return this.terrain.css || {}
    }

    get description() {
        return this.tree
            ? this.terrain.name + " with trees"
            : this.terrain.name
    }

    get infoList() {
        return [
            `${this.description}`,
            `move: ${this.movementCost}`,
            `[${this.x}, ${this.y}]`,
        ]
    }

    get movementCost() {
        return this.tree
            ? this.terrain.movementCost + 2
            : this.terrain.movementCost
    }

    get isWater() {
        return this.terrain.isWater
    }

    get foodYield() {
        return Math.max(0, (this.terrain.foodYield) + (this.tree ? -1 : 0))
    }
    get productionYield() {
        return Math.max(0, (this.terrain.productionYield) + (this.tree ? 1 : 0))
    }
    get tradeYield() {
        return Math.max(0, (this.terrain.tradeYield) + (this.road ? 1 : 0))
    }

    get serialised() {
        let output = {
            terrain: this.terrain.name
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data) {
        return new MapSquare(
            {
                terrain: terrainTypes[data.terrain],
                road: data.road,
                tree: data.tree
            },
            data.x, data.y
        )
    }

    static makeRandomGrid(columns, rows, treeChance = 0, roadChance = 0) {
        const squareFunction = (x, y) => new MapSquare({
            terrain: randomTerrainType(),
            tree: Math.random() < treeChance,
            road: Math.random() < roadChance,
        }, x, y)
        return this.makeGrid(columns, rows, squareFunction)
    }

    static makeGridOf(columns, rows, input) {
        const squareFunction = (x, y) => new MapSquare(input, x, y)
        return this.makeGrid(columns, rows, squareFunction)
    }

    static makeGrid(columns, rows, squareFunction) {
        function makeRow(rowIndex) {
            let row = []
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                row.push(squareFunction(columnIndex, rowIndex))
            }
            return row
        }

        let grid = []
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            grid.push(makeRow(rowIndex))
        }
        return grid
    }
}


export { MapSquare }