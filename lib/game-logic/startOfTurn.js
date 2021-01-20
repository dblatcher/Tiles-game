import { Message, TechDiscoveryChoice } from '../game-entities/Message'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

const startOfTurn = input => state => {
    const { units, activeFaction, towns } = state;

    let notices = []
    const activeFactionOnly = item => { return item.faction === activeFaction }

    units.filter(activeFactionOnly)
        .forEach(unit => {
            notices.push(...unit.processTurn(state))
        })

    towns.filter(activeFactionOnly).forEach(town => {
        notices.push(...town.processTurn(state))
    })

    notices.push(...activeFaction.processTurn(state))

    if (activeFaction.isComputerPlayer) {
        if (!activeFaction.researchGoal && activeFaction.possibleResearchGoals.length > 0) {
            activeFaction.computerPersonality.pickNewTech(state)
        }
        activeFaction.computerPersonality.manageTowns(state)

    } else {
        if (notices.length > 0) {
            state.pendingDialogues.push(new Message(notices))
        }

        const hasAnyResearch = activeFaction.getActualBudget(state).research > 0
        if (!activeFaction.researchGoal && activeFaction.possibleResearchGoals.length > 0 && hasAnyResearch) {
            state.pendingDialogues.push(new TechDiscoveryChoice)
        }
    }

    activeFaction.placesInSightThisTurn = activeFaction.getPlacesInSight(state.towns, state.units, state.mapGrid ? state.mapGrid[0].length:0)

    selectNextOrPreviousUnit(state)
    if (state.tutorial) { state.tutorial.updateEvents(state) }
    return state
}

export default startOfTurn