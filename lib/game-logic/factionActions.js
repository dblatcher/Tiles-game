

const factionActions = {

    CHANGE_BUDGET: input => state => {
        const {category, value, faction} = input
        faction.budget[category] = value
        return {factions: state.factions}
    },

    CHANGE_BUDGET_LOCKED: input => state => {
        const {category, value, faction} = input
        faction.budget.locked[category] = value
        return {factions: state.factions}
    },
}

export default factionActions