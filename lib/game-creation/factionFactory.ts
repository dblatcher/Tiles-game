import { Faction, ComputerFaction } from '../game-entities/Faction'
import townNames from './townNames'


interface factionFunction { (factionType: typeof Faction | typeof ComputerFaction): Faction }

const factionFunctions: factionFunction[] = [
    factionType => new factionType('Montenegro', { color: 'crimson', townNames: townNames.montenegro }, {}),
    factionType => new factionType('Cambodia', { color: 'blue', townNames: townNames.cambodia }, {}),
    factionType => new factionType('Wisconsin', { color: 'green', townNames: townNames.wisconsin }, {}),
    factionType => new factionType('Peru', { color: 'purple', townNames: townNames.peru }, {}),
]

const makeStandardFactions = (amount: number = 2) => {
    const factions: Faction[] = []
    if (amount > factionFunctions.length) { amount = factionFunctions.length }

    for (let i = 0; i < amount; i++) {
        factions.push(factionFunctions[i](i == 0 ? Faction : ComputerFaction))
    }
    return factions
}

export { makeStandardFactions }