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

export {TerrainType, terrainTypes, randomTerrainType} 