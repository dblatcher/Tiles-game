import { Message } from '../game-entities/Message'
import { Faction } from '../game-entities/Faction'
import { GameState } from '../game-entities/GameState'
import { Town } from '../game-entities/Town'

function calculateSpoils(state: GameState, conqueredTown: Town) {

    const totalPopulation = state.towns
        .filter(town => town.faction === conqueredTown.faction)
        .reduce((accumulator, town) => accumulator + town.population, 0)

    // TO DO - weigh the calculation so taking the capital city gets more
    let spoils = Math.floor((conqueredTown.population / totalPopulation) * conqueredTown.faction.treasury)
    return spoils
}

const conquerTown = (state: GameState, town: Town, faction: Faction) => {
    const oldOwner = town.faction

    const spoils = calculateSpoils(state, town)
    faction.treasury += spoils
    oldOwner.treasury -= spoils

    if (town.population === 1) {
        state.towns.splice(state.towns.indexOf(town), 1)
        state.pendingDialogues.push(new Message(`${town.name} destroyed by ${faction.name}! ${spoils} looted!`))
    } else {
        town.citizens.pop()
        town.faction = faction

        town.supportedUnits.forEach(supportedUnit => {
            if (!state.units.includes(supportedUnit)) { return } // should always be included, but just in case
            state.units.splice(state.units.indexOf(supportedUnit), 1)
        })
        town.supportedUnits.splice(0, town.supportedUnits.length)
        state.pendingDialogues.push(new Message(`${town.name} conquered by ${faction.name}! ${spoils} seized!`))
    }

    if (oldOwner.checkIfAlive(state) === false) {
        state.pendingDialogues.push(new Message(`${oldOwner.name} was eradicated!`))
    }

    return state

}

export default conquerTown