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


function getPathToTarget(mapGrid: MapSquare[][], unit: Unit, target: Place) {
    const mapWidth = mapGrid[0].length
    let shiftAmount = getShiftAmount(mapGrid, unit)
    let shiftedGrid = makeShiftedGrid(mapGrid, shiftAmount)

    const graph = makeGraphFromMapGrid(shiftedGrid, unit)
    const pathOfNodes = astar.search(
        graph,
        graph.grid[unit.y][shiftXValue(unit.x, shiftAmount, mapWidth)],
        graph.grid[target.y][shiftXValue(target.x, shiftAmount, mapWidth)],
        { closest: true }
    ) as GridNode[]

    return pathOfNodes.map(gridNode => getMapSquareFromGridNode(gridNode, shiftedGrid))

    function makeShiftedGrid(mapGrid: MapSquare[][], shiftAmount: number) {
        return mapGrid.map(row => {
            return [].concat(row.slice(shiftAmount), row.slice(0, shiftAmount))
        }) as MapSquare[][]
    }

    function makeGraphFromMapGrid(mapGrid: MapSquare[][], unit: Unit) {
        // TO DO
        // use unit.faction.worldMap AI magically knows routes through unknown Places
        // (need to fill in the blanks? decide weight for unknown squares)
        const gridIn = mapGrid.map(row => row.map(
            mapSquare => mapSquare && unit.getCouldEnter(mapSquare) ? mapSquare.movementCost : 0
        ))
        return new Graph(gridIn, { diagonal: true })
    }

    function getMapSquareFromGridNode(step: GridNode, mapGrid: MapSquare[][]) {
        // co-ordinates are reversed on path result - unsure why. Graph maybe uses array of coloumns, not array or rows?
        return mapGrid[step.x] ? mapGrid[step.x][step.y] || null : null
    }
}

function getShiftAmount(mapGrid: MapSquare[][], center: Place) {
    const mapWidth = mapGrid[0] ? mapGrid[0].length : 0
    let shiftAmount = Math.floor(mapWidth / 2) + 1 + center.x
    if (shiftAmount >= mapWidth) { shiftAmount -= mapWidth }

    return shiftAmount
}

function shiftXValue(x: number, shiftAmount: number, mapWidth: number) {
    let value = x - shiftAmount
    if (value < 0) { value += mapWidth }
    return value
}

function hasPathTo(target:Place, unit:Unit, state:GameState) {
    if (!target) { return false }
    if (unit.x == target.x && unit.y == target.y) { return true }
    const path = getPathToTarget(state.mapGrid, unit, target)
    return areSamePlace(target, path[path.length-1])
}

function chooseMoveTowards(target: Place, unit: Unit, state: GameState, possibleMoves: MapSquare[]) {
    if (!target) { return null }
    if (unit.x == target.x && unit.y == target.y) { return null }
    if (possibleMoves.length === 0) { return null }

    if (possibleMoves.some(mapSquare => areSamePlace(mapSquare, target))) {
        return possibleMoves.filter(mapSquare => areSamePlace(mapSquare, target))[0]
    }

    const path = getPathToTarget(state.mapGrid, unit, target)
    const firstSquareOnPath = path[0] || null;

    if (firstSquareOnPath) {
        debugLogAtLevel(4)(
            `PATHFINDING: [${firstSquareOnPath.x},${firstSquareOnPath.y}]`,
            possibleMoves.includes(firstSquareOnPath),
            path
        )
    } else {
        debugLogAtLevel(4)(
            `PATHFINDING: no route found from [${unit.x},${unit.y}] to [${target.x},${target.y}].`
        )
    }
    return firstSquareOnPath
}

function findShortestTotalMovemoveCostTo(target: Place, unit: Unit, state: GameState) {
    if (!target) { return Infinity }
    if (unit.x == target.x && unit.y == target.y) { return 0 }

    const path = getPathToTarget(state.mapGrid, unit, target)
    let count = 0
    path.forEach(mapSquare => count += mapSquare.movementCost)

    debugLogAtLevel(4)(`PATHFINDING shortest route: [${unit.x},${unit.y}] to [${target.x},${target.y}] = ${count}`, path)
    return count
}

function sortByTotalMovemoveCostFor(unit, state) {
    return (placeA, placeB) => {
        return findShortestTotalMovemoveCostTo(placeA, unit, state) - findShortestTotalMovemoveCostTo(placeB, unit, state)
    }
}

export { chooseMoveTowards, findShortestTotalMovemoveCostTo, sortByTotalMovemoveCostFor, hasPathTo }