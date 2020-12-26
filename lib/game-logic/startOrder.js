import { OnGoingOrder } from '../game-entities/OngoingOrder'
import { TextQuestion, OptionsQuestion } from '../game-entities/Questions'
import { Town } from '../game-entities/Town'
import { Message } from '../game-entities/Message'
import killUnit from './killUnit.tsx'

import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'
import { MINIMUM_DISTANCE_BETWEEN_TOWNS } from '../game-logic/constants'
import { getDistanceBetween } from '../utility'

const specialCaseOrders = {
    'Build Town': (state, unit) => {

        const squareUnitIsOn = state.mapGrid[unit.y][unit.x]

        // TO DO - use this logic to check if the build button should be enabled
        let i, distance, tooCloseTown = null;
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

        const buildTown = (name) => state => {
            const { towns, units } = state

            const nameIsTaken = state.towns.map(town=>town.name).includes(name)
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
            towns.push(new Town(unit.faction, squareUnitIsOn, { name }).autoAssignFreeCitizens(state))
            squareUnitIsOn.road = true
            unit.faction.updateWorldMap(state)
            unit.faction.updatePlacesInSightThisTurn(state)

            if (humanPlayersTurn) { state.pendingDialogues.shift() }
            return state
        }

        const cancelBuild = state => {
            state.pendingDialogues.shift()
            state.activeFaction.townNames.unshift(suggestedName)
            return state
        }

        if (humanPlayersTurn) {
            townNameQuestion = new TextQuestion('Enter town name', buildTown, cancelBuild, suggestedName)
            state.pendingDialogues.push(townNameQuestion)
        } else (
            buildTown(suggestedName)(state)
        )
    },

    "Disband"(state, unit) {

        const humanPlayersTurn = !state.activeFaction.isComputerPlayer

        const confirmFunction = (state) => {
            killUnit(state, unit)
            selectNextOrPreviousUnit(state)
            if (humanPlayersTurn) { state.pendingDialogues.shift() }
            return state
        }

        const cancelFunction = (state) => {
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

const startOrder = input => state => {
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