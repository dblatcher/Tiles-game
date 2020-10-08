class MapSquare {
    terrain: TerrainType
    road: boolean
    tree: boolean
    x: number
    y:number
    constructor(input,x,y) {
        this.terrain = input.terrain
        this.road = !!input.road
        this.tree = !!input.tree

        this.x=x
        this.y=y
    }

    static makeRandomGrid(columns, rows, treeChance=0, roadChance=0) {
        const squareFunction = (x,y) =>  new MapSquare({
            terrain: randomTerrainType(),
            tree: Math.random() < treeChance,
            road: Math.random() < roadChance,
        },x,y)
        return this.makeGrid(columns,rows, squareFunction)
    }

    static makeGridOf(columns, rows, input) {
        const squareFunction = (x,y) =>  new MapSquare(input,x,y)
        return this.makeGrid(columns,rows, squareFunction)
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

class TerrainType {
    name: string
    constructor (name, config = {}) {
        this.name = name
    }
}

const terrainTypes = {
    grass: new TerrainType('grass',{}),
    desert: new TerrainType('desert',{}),
    plain: new TerrainType('plain',{}),
    swamp: new TerrainType('swamp',{}),
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}




export {MapSquare, TerrainType, terrainTypes, randomTerrainType}