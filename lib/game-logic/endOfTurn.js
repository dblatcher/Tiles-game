import { Message } from '../game-entities/Message.tsx'

const endOfTurn = input=> state => {
    const { units, factions, towns } = state;
    const activeFactionIndex = factions.indexOf(state.activeFaction)
    state.activeFaction = factions[activeFactionIndex + 1] || factions[0]

    let notices = []
    const activeFactionOnly = item => {return item.faction === state.activeFaction}

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