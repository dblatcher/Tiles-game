const selectNextOrPreviousUnit = (state, isPrevious = false) => {
    // assumption - selectedUnit is in activeFaction
    const {units, activeFaction} = state;
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

const gameActions = {

    endOfTurn: state => {
        const {units, factions} = state;
        units.forEach(unit => {
            if (unit.faction === state.activeFaction) {
                unit.refresh()
            }
        })
        const activeFactionIndex = factions.indexOf(state.activeFaction)
        state.activeFaction = factions[activeFactionIndex + 1] || factions[0]
        state.selectedUnit = units.filter(unit => unit.faction === state.activeFaction)[0] || null
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
            let unitsOnSameSquare = state.units
            .filter (otherUnit => otherUnit.x === unit.x && otherUnit.y === unit.y && otherUnit.faction === unit.faction)

            if (unitsOnSameSquare.length === 1) {
                state.selectedUnit = null
            } else {
                state.selectedUnit = unitsOnSameSquare[unitsOnSameSquare.indexOf(unit) + 1] || unitsOnSameSquare[0]
            }
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