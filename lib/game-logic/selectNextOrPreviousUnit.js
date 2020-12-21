const selectNextOrPreviousUnit = (state, isPrevious = false) => {
    // assumption - selectedUnit is in activeFaction
    const { units, activeFaction } = state;
    const hasMoves = unit => unit.remainingMoves > 0 && !unit.onGoingOrder

    let indexOfSelectedUnit, indexOfNextUnit, nextUnit = null;
    const activeFactionsUnits = units.filter(unit => unit.faction === activeFaction);
    const activeFactionsUnitsWithMoves = activeFactionsUnits.filter(hasMoves);


    if (!state.selectedUnit) {
        state.selectedUnit = activeFactionsUnitsWithMoves[0] || activeFactionsUnits[0] || null
    }
    else if (activeFactionsUnitsWithMoves.length > 0) {
        indexOfSelectedUnit = activeFactionsUnits.indexOf(state.selectedUnit)
        indexOfNextUnit = indexOfSelectedUnit

        while (!nextUnit) {
            indexOfNextUnit = isPrevious
                ? indexOfNextUnit - 1
                : indexOfNextUnit + 1

            if (indexOfNextUnit <= 0) { indexOfNextUnit = activeFactionsUnits.length - 1 }
            if (indexOfNextUnit >= activeFactionsUnits.length) { indexOfNextUnit = 0 }

            if (hasMoves(activeFactionsUnits[indexOfNextUnit])) {
                nextUnit = activeFactionsUnits[indexOfNextUnit]
            }
        }

        state.selectedUnit = nextUnit
    }
    else {
        indexOfSelectedUnit = activeFactionsUnits.indexOf(state.selectedUnit)
        state.selectedUnit = isPrevious
            ? activeFactionsUnits[indexOfSelectedUnit - 1] || activeFactionsUnits[activeFactionsUnits.length - 1] || null
            : activeFactionsUnits[indexOfSelectedUnit + 1] || activeFactionsUnits[0] || null;
    }
    state.interfaceMode = 'MOVE'
    return state
}

export default selectNextOrPreviousUnit