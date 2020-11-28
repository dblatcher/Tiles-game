import startOfTurn from './startOfTurn'

const endOfTurn = input => state => {
    const { factions } = state;

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

    return startOfTurn()(state)
}

export default endOfTurn