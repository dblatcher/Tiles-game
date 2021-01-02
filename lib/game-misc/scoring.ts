import { Faction } from "../game-entities/Faction";
import { GameState } from "../game-entities/GameState";
import { techDiscoveries } from "../game-entities/TechDiscovery";


interface ScoreFunction {
    (faction: Faction, gameState: GameState): number
}

const pointsFor = {
    unit: 5,
    citizen: 1,
    tech: 4,
}


const getUnitScore: ScoreFunction = (faction, gameState) => {
    return gameState.units
        .filter(unit => unit.faction === faction)
        .length * pointsFor.unit
}

const getCitizenScore: ScoreFunction = (faction, gameState) => {
    return gameState.towns
        .filter(town => town.faction === faction)
        .reduce((accumulator, town) => accumulator + town.population, 0) * pointsFor.citizen
}

const getTechScore: ScoreFunction = (faction, gameState) => {
    return faction.knownTech
    .reduce((accumulator, tech) => accumulator + tech.getTier(techDiscoveries), 0) * pointsFor.tech
}

const getTotalScore: ScoreFunction = (faction, gameState) => {
    return 0
        + getUnitScore(faction, gameState)
        + getCitizenScore(faction, gameState)
        + getTechScore(faction, gameState)

}


export { getUnitScore, getCitizenScore, getTechScore, getTotalScore }
