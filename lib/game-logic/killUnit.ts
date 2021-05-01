import { GameState } from '../game-entities/GameState'
import { Message } from '../game-entities/Message'
import { Unit } from '../game-entities/Unit'

const killUnit = (state: GameState, casualty: Unit) => {

    state.fallenUnits = [casualty]
    if (state.units.includes(casualty)) {
        state.units.splice(state.units.indexOf(casualty), 1)
    }

    state.towns.forEach(town => {
        if (town.supportedUnits.includes(casualty)) {
            town.supportedUnits.splice(town.supportedUnits.indexOf(casualty), 1)
        }
    })

    if (casualty.faction.checkIfAlive(state) === false) {
        state.pendingDialogues.push(new Message(`${casualty.faction.name} was eradicated!`))
    }

    const passengers = state.units.filter(unit => unit.isPassengerOf === casualty)
    passengers.forEach(passenger => killUnit(state, passenger))

    return state
}

export default killUnit