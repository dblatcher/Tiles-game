import { GameState } from "../game-entities/GameState";
import { Message } from "../game-entities/Message";
import { Unit } from "../game-entities/Unit";
import { Village } from "../game-entities/Village";

function exploreVillage(state: GameState, village: Village, unit: Unit) {
    const { villages } = state

    let messageList: string[] = []

    messageList.push('This is a village')

    if (messageList.length > 0) {
        state.pendingDialogues.push(new Message(messageList))
    }


    villages.splice(villages.indexOf(village), 1);

    return state
}

export { exploreVillage }