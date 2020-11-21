import { Message } from '../game-entities/Message.tsx'
import { Battle } from '../game-entities/Battle.tsx'
import conquerTown from './conquerTown'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import resolveBattle from './resolveBattle'

const attemptMove = (state, unit, mapSquare) => {

    if (unit.onGoingOrder) { return false }

    const unitSquare = state.mapGrid[unit.y][unit.x];
    const movementCost = unit.getMovementCost(unitSquare, mapSquare)
    const townInMapSquare = state.towns.filter(town => town.x == mapSquare.x && town.y === mapSquare.y)[0]
    const enemyUnitsInMapSquare = state.units.filter(
        otherUnit => (otherUnit.faction !== unit.faction) && otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y
    )

    // TO DO apply 'fatigue penalty' if remainingMoves < 3? can do from Battle
    if (enemyUnitsInMapSquare.length > 0) {
        if (!unit.isAdjacentTo(mapSquare) || unit.remainingMoves <= 0) { return false}

        const dialogueObject = state.selectedUnit.type.attack > 0 
            ? new Battle(state.selectedUnit, enemyUnitsInMapSquare, mapSquare, townInMapSquare)
            : new Message(`${state.selectedUnit.type.displayName} cannot attack.`)

        if (state.activeFaction.isComputerPlayer) {
            if (dialogueObject.type === 'Battle') {
                resolveBattle({battle:dialogueObject })(state)
                return true
            } else {
                return false // if computer player tried to attack with non-combat, need to return false
            }
        } else {
            state.pendingDialogues.push(dialogueObject)
            return dialogueObject.type === 'Battle'
        }

    } else {
        if (!unit.canMoveTo(mapSquare, unitSquare)) { return false}

        if (townInMapSquare && townInMapSquare.faction !== unit.faction && unit.type.attack === 0) {
            if (!state.activeFaction.isComputerPlayer) {
                state.pendingDialogues.push(new Message(`${unit.type.name} units cannot occupy enemy towns.`))
            }
            return false
        }

        unit.remainingMoves = Math.max(unit.remainingMoves - movementCost, 0)
        unit.x = mapSquare.x
        unit.y = mapSquare.y
        unit.faction.updateWorldMap(state) // TO DO - don't loose sight of the square that the unti coudl see before it moved!

        if (townInMapSquare && townInMapSquare.faction !== unit.faction) {
            conquerTown(state, townInMapSquare, unit.faction)
        }
        if (unit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }

        return true
    }

}

export default attemptMove