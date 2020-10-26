import { OnGoingOrder } from './OngoingOrder.tsx'
import { Battle } from './Battle.tsx'
import { Message } from './Message.tsx'
import { TextQuestion } from './TextQuestion.tsx'
import { Town } from './Town.tsx'

import endOfTurn from './game-logic/endOfTurn'
import killUnit from './game-logic/killUnit'
import selectNextOrPreviousUnit from './game-logic/selectNextOrPreviousUnit'
import attemptMove from './game-logic/attemptMove'


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
        const usedDialogue = true

        const buildTown = (name) => state => {
            const { towns, units, mapGrid } = state

            // remove unit 
            // TO DO - when implemented, also remove from the supportedUnits array of the town that built the unit
            if (units.includes(unit)) {
                units.splice(units.indexOf(unit), 1)
            }
            if (state.selectedUnit === unit) { selectNextOrPreviousUnit(state) }

            // add new towns
            towns.push(new Town(unit.faction, squareUnitIsOn, { name }))

            if (usedDialogue) { state.pendingDialogues.pop() }
            return state
        }

        const cancelBuild = state => {
            state.pendingDialogues.pop()
            return state
        }

        if (usedDialogue) {
            state.pendingDialogues.push(new TextQuestion('Enter town name', buildTown, cancelBuild))
        } else (
            buildTown(undefined)(state)
        )


    },
}


const gameActions = {

    endOfTurn,

    selectNextUnit: state => {
        return selectNextOrPreviousUnit(state, false)
    },

    selectPreviousUnit: state => {
        return selectNextOrPreviousUnit(state, true)
    },

    handleMapSquareClick: mapSquare => state => {

        const townInClickedSquare = state.towns
            .filter(town => town.x === mapSquare.x && town.y === mapSquare.y)[0]

        const unitsInClickedSquare = state.units
            .filter(otherUnit => otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y)

        const enemyUnitsInClickedSquare = unitsInClickedSquare
            .filter(otherUnit => otherUnit.faction !== state.activeFaction)

        const ourUnitsInClickedSquare = unitsInClickedSquare
            .filter(otherUnit => otherUnit.faction === state.activeFaction)

        const clickedOnSelectedUnit = mapSquare.x === state.selectedUnit.x && mapSquare.y === state.selectedUnit.y

        if (state.interfaceMode === 'VIEW') {
            state.selectedSquare = mapSquare

            if (townInClickedSquare) {
                state.openTown = townInClickedSquare
                state.fallenUnits = []
            } else if (ourUnitsInClickedSquare.length === 1) {
                state.selectedUnit = ourUnitsInClickedSquare[0]
                state.interfaceMode = 'MOVE'
            } else {
                state.unitPickDialogueChoices = ourUnitsInClickedSquare
            }

            return state;
        }

        if (!state.selectedUnit || (state.selectedUnit && state.selectedUnit.faction !== state.activeFaction)) {
            return state
        }

        if (clickedOnSelectedUnit) {
            state.unitWithMenuOpen = state.unitWithMenuOpen === state.selectedUnit
                ? null
                : state.selectedUnit;
            return state
        }

        if (!state.selectedUnit.isAdjacentTo(mapSquare)) {
            return state
        }

        if (enemyUnitsInClickedSquare.length === 0) {
            attemptMove(state, state.selectedUnit, mapSquare)
            return state;
        } else {

            if (state.selectedUnit.type.attack > 0) {
                state.pendingDialogues.push(new Battle(state.selectedUnit, enemyUnitsInClickedSquare, mapSquare))
            } else {
                state.pendingDialogues.push(new Message(`${state.selectedUnit.type.name} cannot attack.`))
            }

        }

        return state;
    },

    startOrder: input => state => {
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
    },

    cancelOrder: state => {
        state.selectedUnit.onGoingOrder = null
        if (state.selectedUnit.remainingMoves === 0) {
            selectNextOrPreviousUnit(state)
        }
        return state
    },

    cancelBattle: state => {
        state.pendingDialogues.pop()
        return { pendingDialogues: state.pendingDialogues }
    },

    resolveBattle: state => {
        const battle = state.pendingDialogues.pop()
        battle.attacker.remainingMoves = 0;
        let outcome = battle.resolve()
        killUnit(state, outcome.loser)
        if ([outcome.loser, outcome.winner].includes(state.selectedUnit)) { selectNextOrPreviousUnit(state) }
        return state
    },

    acknowledgeMessage: input => state => {
        state.pendingDialogues.pop()
        return state
    },

    pickUnit: input => state => {

        if (input.unit) {
            state.selectedUnit = input.unit
            state.interfaceMode = "MOVE"
        }

        return {
            selectedUnit: state.selectedUnit,
            unitPickDialogueChoices: [],
            interfaceMode: state.interfaceMode
        }
    }
}

export default gameActions