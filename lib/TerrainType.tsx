class TerrainType {
    name: string
    css: object
    movementCost: number
    isWater: boolean
    constructor (name, config = {}) {
        this.name = name
        this.css = config.css
        this.movementCost = config.movementCost || 3
        this.isWater = config.isWater || false
    }
}

const terrainTypes = {
    grass: new TerrainType('grass',{
        css: {
            background: 'greenyellow',
            backgroundImage: 'repeating-radial-gradient(green, transparent 0.6px)',
        }
    }),
    desert: new TerrainType('desert',{
        css: {
            background: 'khaki',
            backgroundImage: 'repeating-radial-gradient(goldenrod, transparent 0.6px)'
        }
    }),
    plain: new TerrainType('plain',{
        css: {
            background: 'burlywood',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent -.1rem, black .5rem)',
        }
    }),
    swamp: new TerrainType('swamp',{
        movementCost: 4,
        css: {
            background: 'rosybrown',
            backgroundImage: 'repeating-radial-gradient(green 7%, transparent 14%), repeating-linear-gradient(transparent 2%, steelblue 4%)'
        }
    }),
    ocean: new TerrainType('ocean',{
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