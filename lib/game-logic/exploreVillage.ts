import { BarbarianFaction, Faction } from "../game-entities/Faction";
import { GameState } from "../game-entities/GameState";
import { MapSquare } from "../game-entities/MapSquare";
import { Message } from "../game-entities/Message";
import { TextQuestion } from "../game-entities/Questions";
import { Town } from "../game-entities/Town";
import { Unit } from "../game-entities/Unit";
import { unitTypes } from "../game-entities/UnitType";
import { Village } from "../game-entities/Village";
import { areSamePlace, getAreaSurrounding, pickAtRandom, randomInt } from "../utility";


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

function addTroops(state: GameState, village: Village, unit: Unit) {
    const unitType = unit.faction.bestCavalryUnit;
    const newUnit = new Unit(unitType, unit.faction, { vetran: true, x: village.mapSquare.x, y: village.mapSquare.y })
    state.pendingDialogues.push(new Message(`The village provides ${unit.faction.name} with a ${newUnit.description}.`))
    state.units.push(newUnit);
}

function releaseBarbarians(state: GameState, village: Village, unit: Unit) {

    const barbarianFaction = BarbarianFaction.getFaction(state)
    const areaAroundVillage: MapSquare[] = getAreaSurrounding(village.mapSquare, state.mapGrid)


    const freeSquaresInArea = areaAroundVillage.filter(mapSquare => {
        if (state.units.find(unit => areSamePlace(unit, mapSquare))) { return false }
        if (state.towns.find(unit => areSamePlace(unit, mapSquare))) { return false }
        return true
    })

    if (freeSquaresInArea.length === 0) {
        state.pendingDialogues.push(new Message(`The village is deserted`))
        return
    }

    const numberOfbarbarians = randomInt(freeSquaresInArea.length) + 1;

    const freeSquaresUsed: MapSquare[] = [];
    let square: MapSquare;
    const unitType = unitTypes.horseman

    for (let i = 0; i < numberOfbarbarians; i++) {
        square = pickAtRandom(freeSquaresInArea.filter(mapSquare => !freeSquaresUsed.includes(mapSquare)))
        if (!square) { break }
        state.units.push(new Unit(unitType, barbarianFaction, { x: square.x, y: square.y }))
        freeSquaresUsed.push(square);
    }

    state.pendingDialogues.push(new Message(`A horde of barbarians emerges!`))
}


function exploreVillage(state: GameState, village: Village, unit: Unit) {

    const couldHaveTownHere = village.mapSquare.couldBuildTownHere(state);
    const eventNumber = randomInt(5) + 1;

    switch (eventNumber) {
        case 1:
        case 5:
            if (couldHaveTownHere) { absorbAsTown(state, village, unit) }
            else { loot(state, village, unit) }
            break;
        case 2:
            loot(state, village, unit)
            break;
        case 3:
            addTroops(state, village, unit)
            break
        case 4:
            releaseBarbarians(state, village, unit)
            break
    }


    village.removeFromGame(state)
    return state
}

export { exploreVillage }