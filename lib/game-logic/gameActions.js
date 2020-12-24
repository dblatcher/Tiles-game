import endOfTurn from './endOfTurn'
import resolveBattle from './resolveBattle'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import startOrder from './startOrder'

const gameActions = {

    // const {} = input
    END_OF_TURN: endOfTurn,

    NEXT_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, false)
    },

    PREVIOUS_UNIT: input => state => {
        return selectNextOrPreviousUnit(state, true)
    },

    // const { unit, orderType } = input
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

    // const {battle} = input
    RESOLVE_BATTLE: resolveBattle,

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

    PICK_STOLEN_TECH: input => state => {
        const { techDiscovery, activeFaction, noDialogue } = input
        activeFaction.knownTech.push(techDiscovery)
        if (activeFaction.researchGoal === techDiscovery) { activeFaction.researchGoal = null }

        if (!noDialogue) {
            state.pendingDialogues.shift()
        }

        return {
            factions: state.factions,
            pendingDialogues: state.pendingDialogues
        }
    },


    CHOOSE_RESEARCH_GOAL: input => state => {
        const { activeFaction, techDiscovery } = input

        if (activeFaction.possibleResearchGoals.includes(techDiscovery)) {
            activeFaction.researchGoal = techDiscovery
            state.pendingDialogues.shift()
        }

        return {
            factions: state.factions,
            pendingDialogues: state.pendingDialogues
        }
    }
}

export default gameActions