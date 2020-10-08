class TerrainType {
    name: string
    css: object
    constructor (name, config = {}) {
        this.name = name
        this.css = config.css
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
        }
    }),
    swamp: new TerrainType('swamp',{
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