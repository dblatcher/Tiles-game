import { OnGoingOrder } from '../game-entities/OngoingOrder.tsx'
import { TextQuestion } from '../game-entities/TextQuestion.tsx'
import { Town } from '../game-entities/Town.tsx'
import { Message } from '../game-entities/Message.tsx'

import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

const specialCaseOrders = {
    townBuilding: (state, unit) => {

        const squareUnitIsOn = state.mapGrid[unit.y][unit.x]

        // TO DO - use this logic to check if the build button should be enabled
        let i, distance, tooCloseTown = null;
        for (i = 0; i < state.towns.length; i++) {
            distance = Math.abs(state.towns[i].x - squareUnitIsOn.x) + Math.abs(state.towns[i].y - squareUnitIsOn.y)
            if (distance < 5) {
                tooCloseTown = state.towns[i]
                break;
            }
        }

        if (tooCloseTown) {
            state.pendingDialogues.push(new Message(`Cannot build a new town so close to ${tooCloseTown.name}.`))
            return state
        }

        //to do - set to false when computer faction's turn
        //to do - handle illegal or duplicate town names
        //to do - prepopulated default town names
        const usedDialogue = true

        const buildTown = (name) => state => {
            const { towns, units } = state

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

            if (usedDialogue) { state.pendingDialogues.shift() }
            return state
        }

        const cancelBuild = state => {
            state.pendingDialogues.shift()
            return state
        }

        if (usedDialogue) {
            state.pendingDialogues.push(new TextQuestion('Enter town name', buildTown, cancelBuild))
        } else (
            buildTown(undefined)(state)
        )
    },
}

const startOrder = input => state => {
    const { unit, orderType } = input
    state.unitWithMenuOpen = null

    if (orderType.specialCase) {
        specialCaseOrders[orderType.requiredUnitSkill](state, unit)
    } else {
        unit.onGoingOrder = new OnGoingOrder(orderType)
        unit.remainingMoves = 0
        selectNextOrPreviousUnit(state)
    }

    return state
}

export default startOrder