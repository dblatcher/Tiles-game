import { OnGoingOrder, OnGoingOrderType } from '../game-entities/OngoingOrder'
import { TextQuestion, OptionsQuestion } from '../game-entities/Questions'
import { Town } from '../game-entities/Town'
import { Message } from '../game-entities/Message'
import killUnit from './killUnit'

import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import { formatListOfProperties } from '../utility'
import { GameState } from '../game-entities/GameState'
import { Unit } from '../game-entities/Unit'
import { debugLogAtLevel } from '../logging'

const specialCaseOrders = {
    'Build Town': (state: GameState, unit: Unit) => {

        const squareUnitIsOn = state.mapGrid[unit.y][unit.x]
        const townsTooClose = squareUnitIsOn.getTownsTooCloseToBuildHere(state);

        //to do - handle illegal or duplicate town names
        //to do - prepopulated default town names
        const humanPlayersTurn = !state.activeFaction.isComputerPlayer
        const suggestedName = state.activeFaction.townNames.shift()


        // TO DO - add tooCloseTown.mapSquare to activeFaction.worldMap
        if (townsTooClose.length > 0) {

            let nameList = formatListOfProperties(townsTooClose, 'name');

            if (humanPlayersTurn) {
                state.pendingDialogues.push(new Message(`Cannot build a new town so close to ${nameList}.`))
            } else {
                state.activeFaction.computerPersonality.failedOrderFlag = true
                debugLogAtLevel(2)(`_${state.activeFaction.name} AI is trying to build a town too close to ${nameList}.`)
            }
            return state
        }

        let townNameQuestion

        const buildTown = (name: string) => (state: GameState) => {

            const nameIsTaken = state.towns.map(town => town.name).includes(name)
            if (nameIsTaken) {
                if (humanPlayersTurn) {
                    townNameQuestion.errorText = `There is already a town called ${name}.`
                    return state
                }
                name = ""
            }

            unit.removeFromGame(state);
            const newTown = Town.addNew(state, squareUnitIsOn, unit.faction, name);

            if (humanPlayersTurn) {
                state.pendingDialogues.shift()
                state.openTown = newTown
                newTown.isProducing = newTown.faction.bestDefensiveLandUnit
            }
            return state
        }

        const cancelBuild = (state: GameState) => {
            state.pendingDialogues.shift()
            state.activeFaction.townNames.unshift(suggestedName)
            return state
        }

        if (humanPlayersTurn) {
            townNameQuestion = new TextQuestion('Name your new town...', buildTown, cancelBuild, suggestedName)
            state.pendingDialogues.push(townNameQuestion)
        } else (
            buildTown(suggestedName)(state)
        )
    },

    "Disband"(state: GameState, unit: Unit) {

        const humanPlayersTurn = !state.activeFaction.isComputerPlayer

        const confirmFunction = (state: GameState) => {
            killUnit(state, unit)
            selectNextOrPreviousUnit(state)
            if (humanPlayersTurn) { state.pendingDialogues.shift() }
            return state
        }

        const cancelFunction = (state: GameState) => {
            state.pendingDialogues.shift()
            return state
        }

        if (humanPlayersTurn) {
            state.pendingDialogues.push(
                new OptionsQuestion(`Really disband ${unit.description}?`, [
                    { label: 'no', handler: cancelFunction },
                    { label: 'yes', handler: confirmFunction },
                ])
            )
        } else (
            confirmFunction(state)
        )

        return state
    }
}

const startOrder = (input: { unit: Unit, orderType: OnGoingOrderType }) => (state: GameState) => {
    const { unit, orderType } = input

    if (orderType.specialCase) {
        specialCaseOrders[orderType.name](state, unit)
    } else {
        unit.onGoingOrder = new OnGoingOrder(orderType)
        unit.remainingMoves = 0
        selectNextOrPreviousUnit(state)
    }

    return state
}

export default startOrder