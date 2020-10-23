import { OnGoingOrder } from './OngoingOrder.tsx'
import { Battle } from './Battle.tsx'


class Message {
    constructor(text, config = {}) {

        if (Array.isArray(text)) {
            text = text.join('\n')
        }

        this.text = text
    }

}

const selectNextOrPreviousUnit = (state, isPrevious = false) => {
    // assumption - selectedUnit is in activeFaction
    const { units, activeFaction } = state;
    const activeFactionsUnits = units.filter(unit => unit.faction === activeFaction);
    const activeFactionsUnitsWithMoves = units.filter(unit => unit.faction === activeFaction && unit.remainingMoves > 0);
    let indexOfSelectedUnit;

    if (!state.selectedUnit) {
        state.selectedUnit = activeFactionsUnitsWithMoves[0] || activeFactionsUnits[0] || null
    }
    else if (state.selectedUnit.remainingMoves > 0) {
        indexOfSelectedUnit = activeFactionsUnitsWithMoves.indexOf(state.selectedUnit)
        state.selectedUnit = isPrevious
            ? activeFactionsUnitsWithMoves[indexOfSelectedUnit - 1] || activeFactionsUnitsWithMoves[activeFactionsUnitsWithMoves.length - 1] || null
            : activeFactionsUnitsWithMoves[indexOfSelectedUnit + 1] || activeFactionsUnitsWithMoves[0] || null;
    }
    else {
        indexOfSelectedUnit = activeFactionsUnits.indexOf(state.selectedUnit)
        state.selectedUnit = isPrevious
            ? activeFactionsUnits[indexOfSelectedUnit - 1] || activeFactionsUnits[activeFactionsUnits.length - 1] || null
            : activeFactionsUnits[indexOfSelectedUnit + 1] || activeFactionsUnits[0] || null;
    }
    return state
}

const attemptMove = (state, unit, target) => {
    const targetSquare = state.mapGrid[target.y][target.x];
    const unitSquare = state.mapGrid[unit.y][unit.x];
    const movementCost = targetSquare.road && unitSquare.road
        ? 1
        : targetSquare.movementCost

    if (!unit.canMoveTo(targetSquare, unitSquare)) {
        console.log('cannot go there')
        return
    }

    if (unit.remainingMoves < movementCost && unit.remainingMoves < unit.type.moves) {
        console.log('NOT ENOUGHT MOVES')
        return
    }

    unit.remainingMoves = Math.max(unit.remainingMoves - movementCost, 0)
    unit.x = target.x
    unit.y = target.y
    if (unit.remainingMoves === 0) {
        selectNextOrPreviousUnit(state)
    }
}


const killUnit = (state, casualty) => {

    state.fallenUnits = [casualty]
    if (state.units.includes(casualty)) {
        state.units.splice(state.units.indexOf(casualty), 1)
    }

    return {
        units: state.units,
        fallenUnits: state.fallenUnits,
    }
}


const gameActions = {

    endOfTurn: state => {
        const { units, factions, towns } = state;
        const activeFactionIndex = factions.indexOf(state.activeFaction)
        state.activeFaction = factions[activeFactionIndex + 1] || factions[0]

        units.forEach(unit => {
            if (unit.faction === state.activeFaction) {

                unit.remainingMoves = unit.type.moves

                if (unit.onGoingOrder) {
                    unit.onGoingOrder.reduceTime(unit)
                }

                if (unit.onGoingOrder && unit.onGoingOrder.timeRemaining <= 0) {
                    let squareUnitIsOn = state.mapGrid[unit.y][unit.x]
                    unit.onGoingOrder.type.applyOutcome(squareUnitIsOn)
                    unit.onGoingOrder = null
                }
            }
        })

        let notices = []

        towns
            .filter(town => town.faction === state.activeFaction)
            .forEach(town => {
                notices.push(...town.processTurn(state))
            })

        if (notices.length > 0) {
            state.pendingMessage = new Message(notices)
        }

        state.selectedUnit = units.filter(unit => unit.faction === state.activeFaction && unit.remainingMoves > 0)[0] || null
        return state
    },

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
                state.pendingBattle = new Battle(state.selectedUnit, enemyUnitsInClickedSquare, mapSquare)
            } else {
                state.pendingMessage = new Message(`${state.selectedUnit.type.name} cannot attack.`)
            }

        }

        return state;
    },

    startOrder: input => state => {
        state.unitWithMenuOpen = null
        input.unit.onGoingOrder = new OnGoingOrder(input.orderType)
        input.unit.remainingMoves = 0
        selectNextOrPreviousUnit(state)
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
        state.pendingBattle = null;
        return { pendingBattle: state.pendingBattle }
    },

    resolveBattle: state => {
        state.pendingBattle.attacker.remainingMoves = 0;
        let outcome = state.pendingBattle.resolve()
        killUnit(state, outcome.loser)
        if ([outcome.loser, outcome.winner].includes(state.selectedUnit)) { selectNextOrPreviousUnit(state) }
        state.pendingBattle = null
        return state
    },

    acknowledgeMessage: input => state => {
        state.pendingMessage = null
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