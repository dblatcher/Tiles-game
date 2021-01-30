import { Faction } from "../game-entities/Faction";
import { MapSquare } from "../game-entities/MapSquare";
import { terrainTypes } from '../game-entities/TerrainType'
import { pickAtRandom } from "../utility";



function findStartingPoints(mapGrid: MapSquare[][]) {
    const possibleStartingPoints: MapSquare[] = []
    mapGrid.forEach(row => {
        possibleStartingPoints.push(...row.filter(mapSquare => {
            return !mapSquare.isWater &&
                mapSquare.terrain !== terrainTypes.arctic &&
                mapSquare.terrain !== terrainTypes.tundra &&
                mapSquare.terrain !== terrainTypes.mountains
        }))
    })

    return possibleStartingPoints
}

function assignStartingPoints(factions:Faction[], possibleStartingPoints:MapSquare[], desiredMinimumDistanceBetwenStartingPoints = 8) {

    let startingPointsAwayFromOtherPlayers = [].concat(possibleStartingPoints)

    const findDistance = (squareA, squareB) => Math.abs(squareA.x - squareB.x) + Math.abs(squareA.y - squareB.y)

    return factions.map(faction => {
        let startingPoint:MapSquare
        if (possibleStartingPoints.length < 1) {
            console.warn('NO STARTING possible POINT FOR:', faction)
            return null
        } else if (startingPointsAwayFromOtherPlayers.length < 1) {
            console.warn('NO STARTING POINT AWAY FROM OTHER PLAYER FOR:', faction)
            startingPoint = pickAtRandom(possibleStartingPoints)
        } else {
            startingPoint = pickAtRandom(startingPointsAwayFromOtherPlayers)
        }

        possibleStartingPoints.splice(possibleStartingPoints.indexOf(startingPoint, 1))
        startingPointsAwayFromOtherPlayers = startingPointsAwayFromOtherPlayers
            .filter(square => findDistance(square, startingPoint) > desiredMinimumDistanceBetwenStartingPoints)

        return startingPoint
    })


}

export { findStartingPoints, assignStartingPoints }