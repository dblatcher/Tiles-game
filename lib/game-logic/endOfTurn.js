import { Message } from '../game-entities/Message.tsx'

const endOfTurn = input => state => {
    const { units, factions, towns } = state;

    const oldFaction = state.activeFaction
    const notDeadFactions = factions.filter(faction => faction.checkIfAlive(state))

    if (notDeadFactions.length === 1 && oldFaction.checkIfAlive(state)) {
        // TO DO - handle victory 
    } else if (notDeadFactions.length > 0) {
        let placeInList = factions.indexOf(oldFaction)
        let nextNotDeadFaction = null
        while (!nextNotDeadFaction) {
            placeInList++
            if (!factions[placeInList]) { placeInList = 0 }
            if (factions[placeInList].checkIfAlive(state) == true ) {
                nextNotDeadFaction = factions[placeInList]
            }
        }
        state.activeFaction = factions[placeInList]
    } 



    let notices = []
    const activeFactionOnly = item => { return item.faction === state.activeFaction }

    units.filter(activeFactionOnly)
        .forEach(unit => {

            unit.remainingMoves = unit.type.moves

            if (unit.onGoingOrder) {
                unit.onGoingOrder.reduceTime(unit)
            }

            if (unit.onGoingOrder && unit.onGoingOrder.timeRemaining <= 0) {
                let squareUnitIsOn = state.mapGrid[unit.y][unit.x]
                unit.onGoingOrder.type.applyOutcome(squareUnitIsOn)
                unit.onGoingOrder = null
            }
        })


    towns.filter(activeFactionOnly).forEach(town => {
        notices.push(...town.processTurn(state))
    })

    notices.push(...state.activeFaction.processTurn(state))

    if (notices.length > 0) {
        state.pendingDialogues.push(new Message(notices))
    }

    state.selectedUnit = units.filter(unit => unit.faction === state.activeFaction && unit.remainingMoves > 0)[0] || null
    return state
}

export default endOfTurn