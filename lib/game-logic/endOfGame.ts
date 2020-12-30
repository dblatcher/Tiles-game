import { Faction } from "../game-entities/Faction";
import { GameState } from "../game-entities/GameState";
import { debugLogAtLevel } from "../logging";

const endOfGame = (input: { winner: Faction }) => (state: GameState) => {

    const {winner} = input

    if (winner) {
        debugLogAtLevel(0)(`${winner.name} has won!`)
    } else {
        debugLogAtLevel(0)(`ALL FACTIONS DEAD`)
    }

    state.gameOver = true
    //state.activeFaction = null

    return state
}

export default endOfGame