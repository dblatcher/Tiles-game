import { Message, TechDiscoveryChoice } from '../game-entities/Message.tsx'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

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
            if (factions[placeInList].checkIfAlive(state) == true) {
                nextNotDeadFaction = factions[placeInList]
            }
        }
        state.activeFaction = factions[placeInList]
    }



    let notices = []
    const activeFactionOnly = item => { return item.faction === state.activeFaction }

    units.filter(activeFactionOnly)
        .forEach(unit => {
            unit.processTurn(state)
        })

    towns.filter(activeFactionOnly).forEach(town => {
        notices.push(...town.processTurn(state))
    })

    notices.push(...state.activeFaction.processTurn(state))

    if (notices.length > 0) {
        state.pendingDialogues.push(new Message(notices))
    }

    if (!state.activeFaction.researchGoal && state.activeFaction.possibleResearchGoals.length > 0) {
        state.pendingDialogues.push(new TechDiscoveryChoice)
    }

    selectNextOrPreviousUnit(state)
    return state
}

export default endOfTurn