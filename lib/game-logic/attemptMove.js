import conquerTown from './conquerTown'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

const attemptMove = (state, unit, target) => {
    const targetSquare = state.mapGrid[target.y][target.x];
    const unitSquare = state.mapGrid[unit.y][unit.x];
    const movementCost = targetSquare.road && unitSquare.road
        ? 1
        : targetSquare.movementCost

    if (!unit.canMoveTo(targetSquare, unitSquare)) {
        return
    }

    if (unit.remainingMoves < movementCost && unit.remainingMoves < unit.type.moves) {
        return
    }

    const townInTargetSquare = state.towns.filter(town => town.x == targetSquare.x && town.y === targetSquare.y)[0]

    if (townInTargetSquare && townInTargetSquare.faction !== unit.faction && unit.type.attack === 0) {
        state.pendingDialogues.push(new Message(`${unit.type.name} units cannot occupy enemy towns.`))
        return
    }

    unit.remainingMoves = Math.max(unit.remainingMoves - movementCost, 0)
    unit.x = target.x
    unit.y = target.y

    if (townInTargetSquare && townInTargetSquare.faction !== unit.faction) {
        conquerTown(state, townInTargetSquare, unit.faction)
    }

    if (unit.remainingMoves === 0) {
        selectNextOrPreviousUnit(state)
    }
}

export default attemptMove