import { terrainTypes } from '../game-entities/TerrainType'
import { MapSquare } from '../game-entities/MapSquare';
import { MapConfig } from '../game-maps/MapConfig'

import { randomInt } from '../utility'
import { LandForm, Continent, LandFormSizes, IceCap, Pangea } from './Continent';

const climates = {
    arctic: [terrainTypes.arctic],
    cold: [terrainTypes.arctic, terrainTypes.tundra, terrainTypes.tundra, terrainTypes.tundra, terrainTypes.mountains, terrainTypes.plain],
    temperate: [terrainTypes.plain, terrainTypes.plain, terrainTypes.hills, terrainTypes.grass, terrainTypes.grass, terrainTypes.grass],
    subtropical: [terrainTypes.plain, terrainTypes.desert, terrainTypes.desert, terrainTypes.desert, terrainTypes.mountains],
    tropical: [terrainTypes.swamp, terrainTypes.grass, terrainTypes.hills]
}



function makeMap(mapConfig: MapConfig) {

    const { width, height, treeChance } = mapConfig
    let continentSize = new LandFormSizes()

    let grid = MapSquare.makeGridOf(width, height, {
        terrain: terrainTypes.ocean
    }) as MapSquare[][]

    let landForms: LandForm[] = [];
    let northPole = new IceCap(width, height, false)
    let southPole = new IceCap(width, height, true)



    switch (mapConfig.landFormOption.id) {
        case 'PANGEA':
            landForms.push(new Pangea(width, height))
            break
        case 'HEMISPHERES':
            landForms.push(northPole, southPole)
            continentSize = new LandFormSizes({
                minOceanSize: Math.floor(8),
                maxOceanSize: Math.floor(width*.2),

                minimumContinentHeight: Math.floor(height*.65),
                maximumContinentHeight: Math.floor(height*.8),

                minimumContinentWidth: Math.floor(width*.35),
                maximumContinentWidth: Math.floor(width*.35),
            })
            landForms.push(...makeRowOfContinents(continentSize), ...makeRowOfContinents(continentSize))
            break
        case 'CONTINENTS':
        default:
            landForms.push(northPole, southPole)
            continentSize = new LandFormSizes()
            landForms.push(...makeRowOfContinents(continentSize), ...makeRowOfContinents(continentSize))
            break
    }


    landForms.forEach(landForm => {
        landForm.places.forEach(place => addLand(place.x, place.y))
    })

    return grid

    function makeRowOfContinents(continentSize) {
        let continents: Continent[] = [];
        let newContinent: Continent = null
        let reachedEnd = false
        while (reachedEnd === false) {
            newContinent = new Continent(width, height, continentSize, continents)
            continents.push(newContinent)
            reachedEnd = newContinent.places.length == 0
        }
        return continents
    }

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