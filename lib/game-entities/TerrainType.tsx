class TerrainType {
    name: string
    css: object
    movementCost: number
    isWater: boolean
    foodYield: number
    productionYield: number
    tradeYield: number
    constructor (name, config = {}) {
        this.name = name
        this.css = config.css
        this.movementCost = config.movementCost || 3
        this.isWater = config.isWater || false

        if (config.yields) {
            this.foodYield = config.yields[0] || 0
            this.productionYield = config.yields[1] || 0
            this.tradeYield = config.yields[2] || 0
        } else {
            this.foodYield = 0
            this.productionYield = 0
            this.tradeYield = 0
        }
    }
}

const terrainTypes = {
    grass: new TerrainType('grass',{
        yields: [4,0,0],
        css: {
            background: 'greenyellow',
            backgroundImage: 'repeating-radial-gradient(green, transparent 0.6px)',
        }
    }),
    desert: new TerrainType('desert',{
        yields: [1,1,0],
        css: {
            background: 'khaki',
            backgroundImage: 'repeating-radial-gradient(goldenrod, transparent 0.6px)'
        }
    }),
    plain: new TerrainType('plain',{
        yields: [3,1,0],
        css: {
            background: 'burlywood',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent -.1em, black .5em)',
        }
    }),
    swamp: new TerrainType('swamp',{
        yields: [2,1,0],
        movementCost: 4,
        css: {
            background: 'rosybrown',
            backgroundImage: 'repeating-radial-gradient(green 7%, transparent 14%), repeating-linear-gradient(transparent 2%, steelblue 4%)'
        }
    }),
    ocean: new TerrainType('ocean',{
       yields: [2,0,1],
       movementCost:2,
       isWater: true,
       css: {
        background: 'lightseagreen',
       } 
    })
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}

export {TerrainType, terrainTypes, randomTerrainType} 