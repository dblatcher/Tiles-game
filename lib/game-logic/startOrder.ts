import { OnGoingOrder, OnGoingOrderType } from '../game-entities/OngoingOrder'
import { TextQuestion, OptionsQuestion } from '../game-entities/Questions'
import { Town } from '../game-entities/Town'
import { Message } from '../game-entities/Message'
import killUnit from './killUnit'

import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import { MINIMUM_DISTANCE_BETWEEN_TOWNS } from '../game-logic/constants'
import { getDistanceBetween } from '../utility'
import { GameState } from '../game-entities/GameState'
import { Unit } from '../game-entities/Unit'

const specialCaseOrders = {
    'Build Town': (state: GameState, unit: Unit) => {

        const squareUnitIsOn = state.mapGrid[unit.y][unit.x]

        // TO DO - use this logic to check if the build button should be enabled
        let i: number, distance: number, tooCloseTown: Town = null;
        for (i = 0; i < state.towns.length; i++) {
            distance = getDistanceBetween(state.towns[i], squareUnitIsOn)
            if (distance < MINIMUM_DISTANCE_BETWEEN_TOWNS) {
                tooCloseTown = state.towns[i]
                break;
            }
        }

        //to do - handle illegal or duplicate town names
        //to do - prepopulated default town names
        const humanPlayersTurn = !state.activeFaction.isComputerPlayer

        const suggestedName = state.activeFaction.townNames.shift()

        // TO DO - add tooCloseTown.mapSquare to activeFaction.worldMap
        if (tooCloseTown) {
            if (humanPlayersTurn) {
                state.pendingDialogues.push(new Message(`Cannot build a new town so close to ${tooCloseTown.name}.`))
            } else {
                console.warn(`*** ${state.activeFaction.name} AI is trying to build a town too close to ${tooCloseTown.name}.`)
            }
            return state
        }

        let townNameQuestion

        const buildTown = (name: string) => (state: GameState) => {
            const { towns, units } = state

            const nameIsTaken = state.towns.map(town => town.name).includes(name)
            if (nameIsTaken) {
                if (humanPlayersTurn) {
                    townNameQuestion.errorText = `There is already a town called ${name}.`
                    return state
                }
                name = ""
            }

            // remove unit from main list
            if (units.includes(unit)) {
                units.splice(units.indexOf(unit), 1)
            }

            // remove unit from the supportedUnits list of its home town
            towns.forEach(town => {
                if (town.supportedUnits.includes(unit)) {
                    town.supportedUnits.splice(town.supportedUnits.indexOf(unit), 1)
                }
            })

            if (state.selectedUnit === unit) { selectNextOrPreviousUnit(state) }

            // add new towns
            const newTown = new Town(unit.faction, squareUnitIsOn, { name }).autoAssignFreeCitizens(state)
            towns.push(newTown)
            squareUnitIsOn.road = true
            unit.faction.updateWorldMap(state)
            unit.faction.updatePlacesInSightThisTurn(state)

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