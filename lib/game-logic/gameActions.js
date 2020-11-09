import endOfTurn from './endOfTurn'
import killUnit from './killUnit'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import startOrder from './startOrder'

const gameActions = {

    END_OF_TURN: endOfTurn,

    NEXT_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, false)
    },

    PREVIOUS_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, true)
    },

    START_ORDER: startOrder,

    CANCEL_ORDER: input => state => {
        state.selectedUnit.onGoingOrder = null
        if (state.selectedUnit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
        return state
    },

    CANCEL_BATTLE: input => state => {
        state.pendingDialogues.shift()
        return { pendingDialogues: state.pendingDialogues }
    },

    RESOLVE_BATTLE: input => state => {
        const battle = state.pendingDialogues[0]
        state.pendingDialogues.shift()
        battle.attacker.remainingMoves = 0;
        let outcome = battle.resolve()
        killUnit(state, outcome.loser)
        outcome.winner.vetran = true
        if ([outcome.loser, outcome.winner].includes(state.selectedUnit)) { selectNextOrPreviousUnit(state) }
        return state
    },

    ACKNOWLEDGE_MESSAGE: input => state => {
        state.pendingDialogues.shift()
        return state
    },

    PICK_UNIT: input => state => {

        if (input.unit) {
            state.selectedUnit = input.unit
            state.interfaceMode = "MOVE"
        }

        return {
            selectedUnit: state.selectedUnit,
            unitPickDialogueChoices: [],
            interfaceMode: state.interfaceMode
        }
    },

    CHOOSE_RESEARCH_GOAL: input => state => {
        const {activeFaction, techDiscovery} = input

        activeFaction.researchGoal = techDiscovery
        state.pendingDialogues.shift()

        return {
            factions: state.factions,
            pendingDialogues: state.pendingDialogues
        }
    }
}

export default gameActions