

const factionActions = {

    CHANGE_BUDGET: input => state => {
        console.log('CHANGE_BUDGET', input)
        const {category, value, faction} = input

        faction.budget[category] = value

        return {
            factions: state.factions
        }
    },

    test: input => state => {
        console.log('run test', input)
        return state
    }
}

export default factionActions