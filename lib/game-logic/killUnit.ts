import { GameState } from '../game-entities/GameState'
import { Message } from '../game-entities/Message'
import { Unit } from '../game-entities/Unit'

const killUnit = (state: GameState, casualty: Unit) => {

    state.fallenUnits = [casualty];
    casualty.removeFromGame(state);

    const passengers = state.units.filter(unit => unit.isPassengerOf === casualty)
    passengers.forEach(passenger => passenger.removeFromGame(state))

    if (casualty.faction.checkIfAlive(state) === false) {
        state.pendingDialogues.push(new Message(`${casualty.faction.name} was eradicated!`))
    }

    return state
}

export default killUnit