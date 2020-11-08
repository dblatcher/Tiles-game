import attemptMove from './attemptMove'

const processMapClick = input => state => {

    const { mapSquare } = input

    const townInClickedSquare = state.towns
        .filter(town => town.x === mapSquare.x && town.y === mapSquare.y)[0]

    const unitsInClickedSquare = state.units
        .filter(otherUnit => otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y)

    const ourUnitsInClickedSquare = unitsInClickedSquare
        .filter(otherUnit => otherUnit.faction === state.activeFaction)

    const clickedOnSelectedUnit = state.selectedUnit && (mapSquare.x === state.selectedUnit.x && mapSquare.y === state.selectedUnit.y)

    if (state.interfaceMode === 'VIEW') {
        state.selectedSquare = mapSquare

        if (townInClickedSquare && townInClickedSquare.faction === state.activeFaction) {
            state.openTown = townInClickedSquare
            state.fallenUnits = []
        } else if (ourUnitsInClickedSquare.length === 1) {
            state.selectedUnit = ourUnitsInClickedSquare[0]
            state.interfaceMode = 'MOVE'
        } else {
            state.unitPickDialogueChoices = ourUnitsInClickedSquare
        }

    } else if (state.interfaceMode === 'MOVE') {

        if (!state.selectedUnit || (state.selectedUnit && state.selectedUnit.faction !== state.activeFaction)) {

        } else if (!state.selectedUnit.isAdjacentTo(mapSquare)) {

        } else if (clickedOnSelectedUnit) {
            state.unitWithMenuOpen = state.unitWithMenuOpen === state.selectedUnit
                ? null
                : state.selectedUnit;
        } else {
            attemptMove(state, state.selectedUnit, mapSquare)
        }
    }

    return state;
}


export default processMapClick