import { Graph, astar } from "../vendor/astar";
import { areSamePlace } from "../utility"

import { GameState } from '../game-entities/GameState'
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { debugLogAtLevel } from "../logging";

interface GridNode {
    f: number
    g: number
    h: number
    parent: GridNode
    visited: boolean
    weight: number
    x: number
    y: number
}

interface Place {
    x: number
    y: number
}

function getMapSquareFromPathStep(step: GridNode, mapGrid: MapSquare[][]) {
    // co-ordinates are reversed on path result - unsure why. Graph maybe uses array of coloumns, not array or rows?
    return mapGrid[step.x] ? mapGrid[step.x][step.y] || null : null
}


function makeGraphFromMapGrid(mapGrid: MapSquare[][], unit: Unit) {
    // TO DO
        // use unit.faction.worldMap AI magically knows routes through unknown Places
        // (need to fill in the blanks? decide weight for unknown squares)
    // TO DO
        // handle the map edge...
        // change the row order in the mapGrid so the unit is treated in the middle of the row?
    const gridIn = mapGrid.map(row => row.map(
        mapSquare => mapSquare && unit.getCouldEnter(mapSquare) ? mapSquare.movementCost : 0
    ))
    return new Graph(gridIn, { diagonal: true })
}

function getPathToTarget(mapGrid: MapSquare[][], unit: Unit, target: Place) {
    const graph = makeGraphFromMapGrid(mapGrid, unit)
    return astar.search(
        graph,
        graph.grid[unit.y][unit.x],
        graph.grid[target.y][target.x],
        { closest: true }
    ) as GridNode[]
}

function chooseMoveTowards(target: Place, unit: Unit, state: GameState, possibleMoves: MapSquare[]) {
    if (!target) { return null }
    if (unit.x == target.x && unit.y == target.y) { return null }
    if (possibleMoves.length === 0) { return null }

    if (possibleMoves.some(mapSquare => areSamePlace(mapSquare, target))) {
        return possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
    }

    const path = getPathToTarget(state.mapGrid, unit, target)
    const firstSquareOnPath = path.length > 0
        ? getMapSquareFromPathStep(path[0], state.mapGrid)
        : null;

    debugLogAtLevel(4)(`PATHFINDING: [${firstSquareOnPath.x},${firstSquareOnPath.y}]`, possibleMoves.includes(firstSquareOnPath), path)
    return firstSquareOnPath
}

function findShortestTotalMovemoveCostTo(target: Place, unit: Unit, state: GameState) {
    if (!target) { return Infinity }
    if (unit.x == target.x && unit.y == target.y) { return 0 }

    const path = getPathToTarget(state.mapGrid, unit, target)
    let count = 0
    path.forEach(gridNode => count+=gridNode.weight)

    debugLogAtLevel(4)(`PATHFINDING, findShortestTotalMovemoveCostTo: [${unit.x},${unit.y}] to [${target.x},${target.y}] = ${count}`,path)
    return count
}

export { chooseMoveTowards, findShortestTotalMovemoveCostTo }