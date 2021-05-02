import { GameState } from "../game-entities/GameState";
import { Message } from "../game-entities/Message";
import { TextQuestion } from "../game-entities/Questions";
import { Town } from "../game-entities/Town";
import { Unit } from "../game-entities/Unit";
import { Village } from "../game-entities/Village";
import { randomInt } from "../utility";


function absorbAsTown(state: GameState, village: Village, unit: Unit) {

    const humanPlayersTurn = !state.activeFaction.isComputerPlayer
    const suggestedName = unit.faction.townNames.shift()

    if (!humanPlayersTurn) {
        Town.addNew(state, village.mapSquare, unit.faction, suggestedName);
        return;
    }

    let townNameQuestion

    const buildTown = (name: string) => (state: GameState) => {
        const nameIsTaken = state.towns.map(town => town.name).includes(name)
        if (nameIsTaken) {
            townNameQuestion.errorText = `There is already a town called ${name}.`
            return state
        }

        const newTown = Town.addNew(state, village.mapSquare, unit.faction, name);
        state.pendingDialogues.shift()
        state.openTown = newTown
        newTown.isProducing = newTown.faction.bestDefensiveLandUnit
        return state
    }

    townNameQuestion = new TextQuestion(`The village is absorbed into ${unit.faction.name} and becomes known as...`, buildTown, null, suggestedName)
    state.pendingDialogues.push(townNameQuestion)
}

function loot(state: GameState, village: Village, unit: Unit) {
    const lootValue = randomInt(8, 2) * 10;
    state.pendingDialogues.push(new Message(`The village pays ${unit.faction.name} a tribute of ${lootValue}!`))
    unit.faction.treasury += lootValue;
}


function exploreVillage(state: GameState, village: Village, unit: Unit) {

    const couldHaveTownHere = village.mapSquare.couldBuildTownHere(state);
    const eventNumber = randomInt(2) + 1;

    switch (eventNumber) {
        case 1:
            if (couldHaveTownHere) { absorbAsTown(state, village, unit) }
            else { loot(state, village, unit) }
            break;
        case 2:
            loot(state, village, unit)
            break;
    }


    village.removeFromGame(state)
    return state
}

export { exploreVillage }