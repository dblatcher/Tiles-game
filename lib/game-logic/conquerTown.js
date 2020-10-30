import { Message } from '../game-entities/Message.tsx'

const conquerTown = (state, town, faction) => {
    if (town.population === 1) {
        state.towns.splice(state.towns.indexOf(town),1)
        state.pendingDialogues.push(new Message(`${town.name} destroyed by ${faction.name}!`))
    } else {
        town.citizens.pop()
        town.faction = faction

        town.supportedUnits.forEach(supportedUnit => {
            if (!state.units.includes(supportedUnit)) {return} // should always be included, but just in case
            state.units.splice(state.units.indexOf(supportedUnit),1)
        })
        town.supportedUnits.splice(0, town.supportedUnits.length)
        state.pendingDialogues.push(new Message(`${town.name} conquered by ${faction.name}!`))
    }

    return state
}

export default conquerTown