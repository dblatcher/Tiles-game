import { Battle } from '../game-entities/Battle.tsx'
import { Message } from '../game-entities/Message.tsx'


import endOfTurn from './endOfTurn'
import killUnit from './killUnit'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import attemptMove from './attemptMove'
import startOrder from './startOrder'


const gameActions = {

    END_OF_TURN: endOfTurn,

    NEXT_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, false)
    },

    PREVIOUS_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, true)
    },

    HANDLE_MAP_CLICK: input => state => {

        const { mapSquare } = input

        const townInClickedSquare = state.towns
            .filter(town => town.x === mapSquare.x && town.y === mapSquare.y)[0]

        const unitsInClickedSquare = state.units
            .filter(otherUnit => otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y)

        const enemyUnitsInClickedSquare = unitsInClickedSquare
            .filter(otherUnit => otherUnit.faction !== state.activeFaction)

        const ourUnitsInClickedSquare = unitsInClickedSquare
            .filter(otherUnit => otherUnit.faction === state.activeFaction)

        const clickedOnSelectedUnit = state.selectedUnit && (mapSquare.x === state.selectedUnit.x && mapSquare.y === state.selectedUnit.y)

        if (state.interfaceMode === 'VIEW') {
            state.selectedSquare = mapSquare

            if (townInClickedSquare && townInClickedSquare.faction === state.activeFaction) {
                state.openTown = townInClickedSquare
                state.fallenUnits = []
            } else if (ourUnitsInClickedSquare.length === 1) {
                state.selectedUnit = ourUnitsInClickedSquare[0]
                state.interfaceMode = 'MOVE'
            } else {
                state.unitPickDialogueChoices = ourUnitsInClickedSquare
            }

        } else if (state.interfaceMode === 'MOVE') {

            if (!state.selectedUnit || (state.selectedUnit && state.selectedUnit.faction !== state.activeFaction)) {

            } else if (!state.selectedUnit.isAdjacentTo(mapSquare)) {

            } else if (clickedOnSelectedUnit) {
                state.unitWithMenuOpen = state.unitWithMenuOpen === state.selectedUnit
                    ? null
                    : state.selectedUnit;
            } else if (enemyUnitsInClickedSquare.length === 0) {
                attemptMove(state, state.selectedUnit, mapSquare)
            } else if (enemyUnitsInClickedSquare.length > 0) {
                if (state.selectedUnit.type.attack > 0) {
                    state.pendingDialogues.push(new Battle(state.selectedUnit, enemyUnitsInClickedSquare, mapSquare))
                } else {
                    state.pendingDialogues.push(new Message(`${state.selectedUnit.type.name} cannot attack.`))
                }
            }
        }

        return state;
    },

    START_ORDER: startOrder,

    CANCEL_ORDER: input => state => {
        state.selectedUnit.onGoingOrder = null
        if (state.selectedUnit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
        return state
    },

    cancelBattle: state => {
        state.pendingDialogues.shift()
        return { pendingDialogues: state.pendingDialogues }
    },

    resolveBattle: state => {
        const battle = state.pendingDialogues[0]
        state.pendingDialogues.shift()
        battle.attacker.remainingMoves = 0;
        let outcome = battle.resolve()
        killUnit(state, outcome.loser)
        if ([outcome.loser, outcome.winner].includes(state.selectedUnit)) { selectNextOrPreviousUnit(state) }
        return state
    },

    acknowledgeMessage: input => state => {
        state.pendingDialogues.shift()
        return state
    },

    pickUnit: input => state => {

        if (input.unit) {
            state.selectedUnit = input.unit
            state.interfaceMode = "MOVE"
        }

        return {
            selectedUnit: state.selectedUnit,
            unitPickDialogueChoices: [],
            interfaceMode: state.interfaceMode
        }
    }
}

export default gameActions