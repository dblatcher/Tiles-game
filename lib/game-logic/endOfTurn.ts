import startOfTurn from './startOfTurn'
import endOfGame from './endOfGame'
import { GameState } from '../game-entities/GameState';

const endOfTurn = input => (state:GameState) => {
    const { factions } = state;

    const oldFaction = state.activeFaction
    const notDeadFactions = factions.filter(faction => faction.checkIfAlive(state))
    const notDeadHumanFactions = notDeadFactions.filter(faction => !faction.isComputerPlayer)


    const tutorialInProgress = state.tutorial && state.tutorial.enabled
    
    if (notDeadFactions.length === 1 && !tutorialInProgress) {
        return endOfGame({ winner: notDeadFactions[0] })(state)
    }

    if (notDeadHumanFactions.length === 0) {
        return endOfGame({ winner: null })(state)
    }

    let placeInList = factions.indexOf(oldFaction)
    let nextNotDeadFaction = null
    let startingNewRound = false
    while (!nextNotDeadFaction) {
        placeInList++
        if (placeInList >= factions.length) { placeInList = 0; startingNewRound = true }
        if (notDeadFactions.includes(factions[placeInList])) {
            nextNotDeadFaction = factions[placeInList]
        }
    }
    state.activeFaction = nextNotDeadFaction
    if (startingNewRound) { state.turnNumber = state.turnNumber + 1 }

    return startOfTurn()(state)
}

export default endOfTurn