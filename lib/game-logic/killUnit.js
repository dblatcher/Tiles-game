import {Message} from '../game-entities/Message.tsx'

const killUnit = (state, casualty) => {

    state.fallenUnits = [casualty]
    if (state.units.includes(casualty)) {
        state.units.splice(state.units.indexOf(casualty), 1)
    }

    state.towns.forEach (town => {
        if (town.supportedUnits.includes(casualty)) {
            town.supportedUnits.splice(town.supportedUnits.indexOf(casualty), 1)
        }
    })

    if (casualty.faction.checkIfAlive(state) === false) {
        state.pendingDialogues.push(new Message(`${casualty.faction.name} was eradicated!`))
    }

    return state
}

export default killUnit