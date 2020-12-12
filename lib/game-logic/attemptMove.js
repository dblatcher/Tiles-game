import { Message } from '../game-entities/Message.tsx'
import { Battle } from '../game-entities/Battle.tsx'
import conquerTown from './conquerTown'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import resolveBattle from './resolveBattle'
import { areSamePlace } from '../utility'

const attemptMove = (state, unit, mapSquare) => {
    if (unit.onGoingOrder) { return false }
    if (!unit.isAdjacentTo(mapSquare, state.mapGrid[0].length ) || unit.remainingMoves <= 0) { return false }

    const unitSquare = state.mapGrid[unit.y][unit.x];
    const townInMapSquare = state.towns.filter(town => town.x == mapSquare.x && town.y === mapSquare.y)[0]
    const unitsInMapSquare = state.units.filter(otherUnit => areSamePlace(otherUnit, mapSquare));
    const enemyUnitsInMapSquare = unitsInMapSquare.filter(otherUnit => (otherUnit.faction !== unit.faction))


    // TO DO - change this logic - not very clear
    if (enemyUnitsInMapSquare.length > 0) {
        // TO DO apply 'fatigue penalty' if remainingMoves < 3? can do from Battle
        const dialogueObject = state.selectedUnit.type.attack > 0
            ? new Battle(state.selectedUnit, enemyUnitsInMapSquare, mapSquare, townInMapSquare)
            : new Message(`${state.selectedUnit.type.displayName} cannot attack.`)

        if (state.activeFaction.isComputerPlayer) {
            if (dialogueObject.type === 'Battle') {
                resolveBattle({ battle: dialogueObject })(state)
                return true
            } else {
                return false // if computer player tried to attack with non-combat, need to return false
            }
        } else {
            state.pendingDialogues.push(dialogueObject)
            return dialogueObject.type === 'Battle' // false if 'cannot attack' message
        }
    }


    if (townInMapSquare && townInMapSquare.faction !== unit.faction) {
        if (!unit.canMoveToOrAttack(mapSquare, unitSquare, townInMapSquare, unitsInMapSquare, state.mapGrid[0].length)) {
            if (!state.activeFaction.isComputerPlayer) {
                if (unit.type.isNaval) {
                    state.pendingDialogues.push(new Message(`Naval units cannot occupy enemy towns.`))
                } else if (unit.type.attack === 0) {
                    state.pendingDialogues.push(new Message(`${unit.type.name} units cannot occupy enemy towns.`))
                }
            }
            return false
        }

        executeMove()
        return true
    } 


    if (!unit.type.isNaval && mapSquare.isWater) {
        if (!unit.canMoveToOrAttack(mapSquare, unitSquare, townInMapSquare, unitsInMapSquare, state.mapGrid[0].length)) { return false }

        const transports = unitsInMapSquare.filter(
            otherUnit => otherUnit.type.isNaval &&
                otherUnit.faction === unit.faction &&
                otherUnit.type.passengerCapacity &&
                otherUnit.passengers.length < otherUnit.type.passengerCapacity
        )

        if (transports.length === 0) {return false}

        //TO DO - make unit board transport...
        //use dialogue to pick if more than one transport (human player)
        //add ai function for computer player to paick from multiple transports
        if (unit.isPassengerOf) { unit.leaveTransport() }
        unit.boardTransport(transports[0])
        executeMove()
        return true

    } 

if (!unit.canMoveToOrAttack(mapSquare, unitSquare, townInMapSquare, unitsInMapSquare, state.mapGrid[0].length)) { return false }
    unit.leaveTransport()
    executeMove()
    return true

    // TO DO change to a higher order setState function
    // so it can be passed as an EXECUTE_STATE_FUNCTION command
    // for confirmation dialogues
    function executeMove() {
        const movementCost = unit.getMovementCost(unitSquare, mapSquare, townInMapSquare, unitsInMapSquare)
        unit.remainingMoves = Math.max(unit.remainingMoves - movementCost, 0)
        unit.x = mapSquare.x
        unit.y = mapSquare.y

        unit.passengers.forEach(passenger => {
            passenger.x = mapSquare.x
            passenger.y = mapSquare.y
        })

        unit.faction.updateWorldMap(state) // TO DO - don't loose sight of the square that the unit could see before it moved!

        if (unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)) {
            unit.remainingMoves = 0
        }
        if (unit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
        if (townInMapSquare && townInMapSquare.faction !== unit.faction) {
            conquerTown(state, townInMapSquare, unit.faction)
        }
    }

}

export default attemptMove