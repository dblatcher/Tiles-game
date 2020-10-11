class TerrainType {
    name: string
    css: object
    movementCost: number
    constructor (name, config = {}) {
        this.name = name
        this.css = config.css
        this.movementCost = config.movementCost || 3
    }
}

const terrainTypes = {
    grass: new TerrainType('grass',{
        css: {
            background: 'greenyellow',
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
            backgroundImage: 'repeating-linear-gradient(0deg, transparent -.1rem, black .5rem)'
        }
    }),
    swamp: new TerrainType('swamp',{
        movementCost: 4,
        css: {
            background: 'steelblue',
            backgroundImage: 'repeating-radial-gradient(rosybrown, transparent 0.5px), repeating-linear-gradient(transparent 1.5px, green 2px)'
        }
    }),
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}

export {TerrainType, terrainTypes, randomTerrainType} 