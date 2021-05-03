import { Message } from '../game-entities/Message'
import { Faction } from '../game-entities/Faction'
import { GameState } from '../game-entities/GameState'
import { Town } from '../game-entities/Town'
import { TechStealQuestion } from '../game-entities/Questions'
import gameActions from './gameActions'
import { ComputerPersonality } from '../game-ai/ComputerPersonality'
import { Unit } from '../game-entities/Unit'


function calculateSpoils(state: GameState, conqueredTown: Town) {

    const totalPopulation = state.towns
        .filter(town => town.faction === conqueredTown.faction)
        .reduce((accumulator, town) => accumulator + town.population, 0)

    // TO DO - weigh the calculation so taking the capital city gets more
    let spoils = Math.floor((conqueredTown.population / totalPopulation) * conqueredTown.faction.treasury)
    return spoils
}

const conquerTown = (state: GameState, town: Town, conqueringFaction: Faction) => {
    const oldOwner = town.faction

    const spoils = calculateSpoils(state, town)
    conqueringFaction.treasury += spoils
    oldOwner.treasury -= spoils

    let messageList: string[] = []

    if (town.population === 1) {
        state.towns.splice(state.towns.indexOf(town), 1)
        messageList.push(`${town.name} destroyed by ${conqueringFaction.name}! ${spoils} looted!`)
    } else {
        town.citizens.pop()
        town.faction = conqueringFaction
        messageList.push(`${town.name} conquered by ${conqueringFaction.name}! ${spoils} seized!`)
    }

    // don't run town.supportedUnits.forEach directly as the array is modified by unit.removeFromGame
    town.supportedUnits.concat([]).forEach(unit => {unit.removeFromGame(state)})

    if (oldOwner.checkIfAlive(state) === false) {
        messageList.push(`${oldOwner.name} was eradicated!`)
    }

    const techThatconqueringFactionCanTake = oldOwner.knownTech
        .filter(tech => !conqueringFaction.knownTech.includes(tech))


    if (messageList.length > 0) {
        state.pendingDialogues.push(new Message(messageList))
    }

    if (techThatconqueringFactionCanTake.length > 0) {
        if (conqueringFaction.isComputerPlayer && !conqueringFaction.isBarbarianFaction) {

            let ai = conqueringFaction.computerPersonality as ComputerPersonality
            let pickedStolenTech = ai.pickStolenTech(techThatconqueringFactionCanTake, state)
            gameActions.PICK_STOLEN_TECH({ activeFaction: conqueringFaction, techDiscovery: pickedStolenTech, noDialogue: true })(state)
            messageList.push(`${conqueringFaction.name} took ${pickedStolenTech.description} from ${oldOwner.name}.`)

        } else {
            state.pendingDialogues.push(new TechStealQuestion(`Choose a technology to steal from ${oldOwner.name}:`, techThatconqueringFactionCanTake))
        }
    }

    return state

}

export default conquerTown