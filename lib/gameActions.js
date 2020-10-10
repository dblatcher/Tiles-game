import { unitTypes, factions } from './Unit.tsx'

const selectNextOrPreviousUnit = (state, isPrevious = false) => {
    // assumption - selectedUnit is in activeFaction
    const activeFactionsUnits = state.units.filter(unit => unit.faction === state.activeFaction);
    const activeFactionsUnitsWithMoves = state.units.filter(unit => unit.faction === state.activeFaction && unit.remainingMoves > 0);
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

const gameActions = {

    endOfTurn: state => {
        state.units.forEach(unit => {
            if (unit.faction === state.activeFaction) {
                unit.refresh()
            }
        })
        const activeFactionIndex = factions.indexOf(state.activeFaction)
        state.activeFaction = factions[activeFactionIndex + 1] || factions[0]
        state.selectedUnit = state.units.filter(unit => unit.faction === state.activeFaction)[0] || null
        return state
    },

    selectNextUnit: state => {
        return selectNextOrPreviousUnit(state, false)
    },

    selectPreviousUnit: state => {
        return selectNextOrPreviousUnit(state, true)
    },

    handleUnitClick: unit => state => {
        if (unit === state.selectedUnit) {
            state.selectedUnit = null
        } else {
            if (unit.faction === state.activeFaction) {
                state.selectedUnit = unit
            }
        }
        return state
    },

    handleMapSquareClick: mapSquare => state => {
        if (state.selectedUnit && state.selectedUnit.faction === state.activeFaction ) {
            state.selectedUnit.attemptMoveTo(mapSquare)
        }
        return state;
    }

}

export default gameActions