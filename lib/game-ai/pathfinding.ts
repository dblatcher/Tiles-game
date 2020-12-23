import { Graph, astar } from "../vendor/astar";
import { areSamePlace } from "../utility"

import { GameState } from '../game-entities/GameState'
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';

function chooseMoveTowards(target, unit:Unit, state:GameState, possibleMoves:MapSquare[]) {
    if (!target) { return null }
    if (unit.x == target.x && unit.y == target.y) { return null }
    if (possibleMoves.length === 0) { return null }

    if (possibleMoves.some(mapSquare => areSamePlace(mapSquare, target))) {
        return possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
    }

    // TO DO - weight by movement cost
    // treat enemy towns and units as obstacles 
    // (can use separate getCouldEnter calls with towns and/or units included to weight by enemy presence)
    // use unit.faction.worldMap AI magically knows routes through unknown Places
    // (need to fill in the blanks? decide weight for unknown squares)
    const gridIn = state.mapGrid
        .map(row => row.map(
            mapSquare => unit.getCouldEnter(mapSquare) ? 1 : 0
        ))

    const graph = new Graph(gridIn, { diagonal: true })
    const path = astar.search(
        graph,
        graph.grid[unit.y][unit.x],
        graph.grid[target.y][target.x],
        { closest: true }
    )
    if (!path[0]) {return null}

    // co-ordinates are reversed on path result - unsure why. Graph maybe uses array of coloumns, not array or rows?
    const firstSquareOnPath = state.mapGrid[path[0].x][path[0].y]

    // console.log(`[${firstStep.x},${firstStep.y}]`, possibleMoves.includes(firstSquareOnPath))
    return firstSquareOnPath
}


export { chooseMoveTowards }