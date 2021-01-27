import attemptMove from './attemptMove.ts'

const processMapClick = (input, effectiveMode) => state => {

    const { mapSquare } = input

    const townInClickedSquare = state.towns
        .filter(town => town.x === mapSquare.x && town.y === mapSquare.y)[0]

    const unitsInClickedSquare = state.units
        .filter(otherUnit => otherUnit.x === mapSquare.x && otherUnit.y === mapSquare.y)

    const ourUnitsInClickedSquare = unitsInClickedSquare
        .filter(otherUnit => otherUnit.faction === state.activeFaction)

    const clickedOnSelectedUnit = state.selectedUnit && (mapSquare.x === state.selectedUnit.x && mapSquare.y === state.selectedUnit.y)

    if (effectiveMode === 'VIEW') {
        state.selectedSquare = mapSquare

        if (townInClickedSquare && townInClickedSquare.faction === state.activeFaction) {
            state.openTown = townInClickedSquare
            state.fallenUnits = []
        } else if (ourUnitsInClickedSquare.length === 1) {
            state.selectedUnit = ourUnitsInClickedSquare[0]
            effectiveMode = 'MOVE'
        } else {
            state.unitPickDialogueChoices = ourUnitsInClickedSquare
        }

    } else if (effectiveMode === 'MOVE') {

        if (state.selectedUnit && state.selectedUnit.faction === state.activeFaction) {
            if (clickedOnSelectedUnit) {
            } else if (state.selectedUnit.isAdjacentTo(mapSquare, state.mapGrid[0].length)) {
                attemptMove(state, state.selectedUnit, mapSquare)
            }
        }
    }

    if (state.tutorial) { state.tutorial.updateEvents(state) }
    return state;
}


export default processMapClick