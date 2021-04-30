import { Faction } from "../game-entities/Faction"
import { GameState } from "../game-entities/GameState"


const factionActions = {

    CHANGE_BUDGET: (input: { category: string, value: number, faction: Faction }) => (state: GameState) => {
        const { category, value, faction } = input
        faction.budget[category] = value
        return state
    },

    CHANGE_BUDGET_LOCKED: (input: { category: string, value: number, faction: Faction }) => (state: GameState) => {
        const { category, value, faction } = input
        faction.budget.locked[category] = value
        return state
    },
}

export default factionActions