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
            background: 'rosybrown',
        }
    }),
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}

export {TerrainType, terrainTypes, randomTerrainType} 