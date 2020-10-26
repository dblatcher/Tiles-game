const killUnit = (state, casualty) => {

    state.fallenUnits = [casualty]
    if (state.units.includes(casualty)) {
        state.units.splice(state.units.indexOf(casualty), 1)
    }

    state.towns.forEach (town => {
        if (town.supportedUnits.includes(casualty)) {
            town.supportedUnits.splice(town.supportedUnits.indexOf(casualty), 1)
        }
    })

    return state
}

export default killUnit