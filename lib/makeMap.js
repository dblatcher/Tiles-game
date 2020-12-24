import { terrainTypes } from './game-entities/TerrainType'
import { MapSquare } from '../lib/game-entities/MapSquare';


const climates = {
    arctic: [terrainTypes.arctic],
    cold: [terrainTypes.arctic, terrainTypes.tundra, terrainTypes.tundra, terrainTypes.tundra, terrainTypes.mountains, terrainTypes.plain],
    temperate: [terrainTypes.plain, terrainTypes.plain, terrainTypes.hills, terrainTypes.grass, terrainTypes.grass, terrainTypes.grass],
    subtropical: [terrainTypes.plain, terrainTypes.desert, terrainTypes.desert,  terrainTypes.desert, terrainTypes.mountains],
    tropical: [terrainTypes.swamp, terrainTypes.grass, terrainTypes.hills]
}

const randomInt = (range, min = 0) => Math.max(Math.floor(Math.random() * range), min);

function Continent(mapWidth, mapHeight, previousContinent = null) {
    const maxOceanSize = 6
    const minOceanSize = 0
    const minimumContinentHeight = 6
    const minimumContinentWidth = 5
    const maximumContinentWidth = 12


    this.places = []
    this.height = randomInt(mapHeight, minimumContinentHeight)
    this.y = randomInt(mapHeight - this.height)


    if (!previousContinent) {
        this.width = randomInt(maximumContinentWidth, minimumContinentWidth)
        this.x = randomInt(maxOceanSize, minOceanSize)
    } else {
        this.x = randomInt(maxOceanSize, minOceanSize) + previousContinent.x + previousContinent.width

        this.width = Math.min(
            randomInt(maximumContinentWidth, minimumContinentWidth),
            mapWidth - this.x
        )
    }

    let widthAtLongitude = 0, coastLatitude = 0
    for (let y = 0; y < this.height; y++) {

        widthAtLongitude = randomInt(this.width) + 1
        coastLatitude = randomInt(this.width - widthAtLongitude)

        for (let x = coastLatitude; x <= coastLatitude + widthAtLongitude; x++) {
            if (x + this.x < mapWidth && y + this.y < mapHeight) {
                this.places.push({ x: x + this.x, y: y + this.y })
            }
        }
    }

}


function makeMap(width, height, treeChance = .25) {

    let grid = MapSquare.makeGridOf(width, height, {
        terrain: terrainTypes.ocean
    })


    //draw arctic and antarctic
    for (let i = 0; i < width; i++) {
        addLand(i, 0);
        addLand(i, height - 1);
    }

    let continents = [], previousContinent = null;
    for (let i = 0; i < 6; i++) {
        continents.push(new Continent(width, height, previousContinent))
        previousContinent = continents[continents.length - 1]

        for (let i = 0; i < previousContinent.places.length; i++) {
            addLand(previousContinent.places[i].x, previousContinent.places[i].y)
        }
    }

    continents = []; 
    previousContinent = null;
    for (let i = 0; i < 6; i++) {
        continents.push(new Continent(width, height, previousContinent))
        previousContinent = continents[continents.length - 1]

        for (let i = 0; i < previousContinent.places.length; i++) {
            addLand(previousContinent.places[i].x, previousContinent.places[i].y)
        }
    }

    return grid

    function getClimate(y) {
        if (y == 0 || y == height - 1) {
            return 'arctic'
        }
        let distanceFromEquator = Math.abs(y - Math.round(height / 2))
        let relativeDistance = distanceFromEquator / height

        if (relativeDistance >= .475) { return 'arctic' }
        if (relativeDistance >= .4) { return 'cold' }
        if (relativeDistance >= .2) { return 'temperate' }
        if (relativeDistance >= .1) { return 'subtropical' }
        return 'tropical'
    }

    function addLand(x, y) {
        const climate = climates[getClimate(y)]
        const index = randomInt(climate.length)
        grid[y][x].terrain = climate[index]
        grid[y][x].tree = !grid[y][x].terrain.neverTrees && (Math.random() < treeChance)

    }

}

export { makeMap }