import { Message } from '../game-entities/Message.tsx'
import { Battle } from '../game-entities/Battle.tsx'
import conquerTown from './conquerTown'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

const attemptMove = (state, unit, mapSquare) => {

    const unitSquare = state.mapGrid[unit.y][unit.x];
    const movementCost = mapSquare.road && unitSquare.road
        ? 1
        : mapSquare.movementCost
    const townInMapSquare = state.towns.filter(town => town.x == mapSquare.x && town.y === mapSquare.y)[0]

    const enemyUnitsInMapSquare = state.units.filter(
        otherUnit => (otherUnit.faction !== unit.faction) && otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y
    )


    // TO DO apply 'fatigue penalty' if remainingMoves < 3? can do from Battle
    if (enemyUnitsInMapSquare.length > 0) {
        if (!unit.isAdjacentTo(mapSquare) || unit.remainingMoves <= 0) { return }

        if (state.selectedUnit.type.attack > 0) {
            state.pendingDialogues.push(new Battle(state.selectedUnit, enemyUnitsInMapSquare, mapSquare))
        } else {
            state.pendingDialogues.push(new Message(`${state.selectedUnit.type.displayName} cannot attack.`))
        }

    } else {
        if (!unit.canMoveTo(mapSquare, unitSquare)) { return }

        if (townInMapSquare && townInMapSquare.faction !== unit.faction && unit.type.attack === 0) {
            state.pendingDialogues.push(new Message(`${unit.type.name} units cannot occupy enemy towns.`))
            return
        }

        unit.remainingMoves = Math.max(unit.remainingMoves - movementCost, 0)
        unit.x = mapSquare.x
        unit.y = mapSquare.y

        if (townInMapSquare && townInMapSquare.faction !== unit.faction) {
            conquerTown(state, townInMapSquare, unit.faction)
        }
        if (unit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
    }

}

export default attemptMove