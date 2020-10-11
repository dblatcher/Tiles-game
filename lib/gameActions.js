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

    if (unit.remainingMoves < movementCost) {
        console.log('NOT ENOUGHT MOVES')
        return
    }

    if (!unit.isInRangeOf(targetSquare)) {
        console.log('TOO FAR')
        return
    }

    unit.remainingMoves = unit.remainingMoves - movementCost
    unit.x = target.x
    unit.y = target.y
    if (unit.remainingMoves === 0) {
        selectNextOrPreviousUnit(state)
    }
}



const gameActions = {

    endOfTurn: state => {
        const { units, factions } = state;
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

    handleUnitClick: clickedUnit => state => {
        const unitsOnSameSquareAsClickedUnit = state.units
            .filter(otherUnit => otherUnit.x === clickedUnit.x && otherUnit.y === clickedUnit.y && otherUnit.faction === clickedUnit.faction)
        const clickedAndSelectedUnitAreOnSameSquare = unitsOnSameSquareAsClickedUnit.indexOf(state.selectedUnit) !== -1

        if (state.interfaceMode === 'MOVE') {
            if (clickedAndSelectedUnitAreOnSameSquare) {
                if (unitsOnSameSquareAsClickedUnit.length === 1) {
                    state.selectedUnit = null
                } else {
                    state.selectedUnit = unitsOnSameSquareAsClickedUnit[unitsOnSameSquareAsClickedUnit.indexOf(state.selectedUnit) + 1] || unitsOnSameSquareAsClickedUnit[0]
                }
            } else if (clickedUnit.faction === state.activeFaction) {
                if (state.selectedUnit && state.selectedUnit.isInRangeOf(clickedUnit)) {
                    attemptMove(state, state.selectedUnit, clickedUnit)
                } else {
                    state.selectedUnit = clickedUnit
                }
            } else {
                console.log('Attacks not implemented yet!')
            }
        } else if (state.interfaceMode === 'VIEW') {
            state.selectedSquare = state.mapGrid[clickedUnit.y][clickedUnit.x]
        }

        return state
    },

    handleMapSquareClick: mapSquare => state => {

        if (state.interfaceMode === 'MOVE') {
            if (state.selectedUnit && state.selectedUnit.faction === state.activeFaction) {
                attemptMove(state, state.selectedUnit, mapSquare)
            }
        } else if (state.interfaceMode === 'VIEW') {
            state.selectedSquare = mapSquare
        }
        return state;
    }

}

export default gameActions