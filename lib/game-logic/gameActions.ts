import { Faction } from '../game-entities/Faction'
import { GameState } from '../game-entities/GameState'
import { TechDiscovery } from '../game-entities/TechDiscovery'
import { Unit } from '../game-entities/Unit'
import endOfTurn from './endOfTurn'
import resolveBattle from './resolveBattle'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import startOrder from './startOrder'

const gameActions = {

    // const {} = input
    END_OF_TURN: endOfTurn,

    NEXT_UNIT: (input) => (state: GameState) => {
        return selectNextOrPreviousUnit(state, false)
    },

    PREVIOUS_UNIT: (input) => (state: GameState) => {
        return selectNextOrPreviousUnit(state, true)
    },

    // const { unit, orderType } = input
    START_ORDER: startOrder,

    CANCEL_ORDER: (input) => (state: GameState) => {
        state.selectedUnit.onGoingOrder = null
        if (state.selectedUnit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
        return state
    },

    CANCEL_BATTLE: (input) => (state: GameState) => {
        state.pendingDialogues.shift()
        return state
    },

    // const {battle} = input
    RESOLVE_BATTLE: resolveBattle,

    ACKNOWLEDGE_MESSAGE: (input) => (state: GameState) => {
        state.pendingDialogues.shift()
        return state
    },

    PICK_UNIT: (input: { unit: Unit }) => (state: GameState) => {

        if (input.unit) {
            state.selectedUnit = input.unit
            state.interfaceMode = "MOVE"
        }
        state.unitPickDialogueChoices = []
        return state
    },

    PICK_STOLEN_TECH: (input: { techDiscovery: TechDiscovery, activeFaction: Faction, noDialogue: boolean }) => (state: GameState) => {
        const { techDiscovery, activeFaction, noDialogue } = input
        activeFaction.knownTech.push(techDiscovery)
        if (activeFaction.researchGoal === techDiscovery) { activeFaction.researchGoal = null }

        if (!noDialogue) {
            state.pendingDialogues.shift()
        }

        return state
    },


    CHOOSE_RESEARCH_GOAL: (input: { activeFaction: Faction, techDiscovery: TechDiscovery }) => (state: GameState) => {
        const { activeFaction, techDiscovery } = input

        if (activeFaction.possibleResearchGoals.includes(techDiscovery)) {
            activeFaction.researchGoal = techDiscovery
            state.pendingDialogues.shift()
        }

        return state
    }
}

export default gameActions