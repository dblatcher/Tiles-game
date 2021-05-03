import { MapSquare } from "../game-entities/MapSquare";
import { Village } from "../game-entities/Village";
import { MapConfig } from "../game-maps/MapConfig";
import { getAreaSurrounding, pickAtRandom, removePossibleMembers } from "../utility";


function placeVillages(mapGrid: MapSquare[][], startingPoints: MapSquare[], mapConfig: MapConfig): Village[] {

    const villages: Village[] = [];
    const potentialSquares = mapGrid.flat().filter(mapSquare => !mapSquare.isWater);
    const villagesToPlace = potentialSquares.length * mapConfig.villageRate

    startingPoints.forEach(place => {
        if (place) { removePossibleMembers(potentialSquares, [place, ...getAreaSurrounding(place, mapGrid)]) }
    })


    let villageLocation: MapSquare;
    for (let i = 0; i < villagesToPlace; i++) {
        if (potentialSquares.length === 0) { break }
        villageLocation = pickAtRandom(potentialSquares);

        villages.push(new Village(villageLocation, {}))
        removePossibleMembers(potentialSquares, [villageLocation, ...getAreaSurrounding(villageLocation, mapGrid)])
    }

    return villages
}

export { placeVillages }