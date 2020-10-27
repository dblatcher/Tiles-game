import Window from "./Window";

export default class FactionWindow extends React.Component {

    constructor(props) {
        super(props)

        this.handleRangeEvent = this.handleRangeEvent.bind(this)
        this.handleLockEvent = this.handleLockEvent.bind(this)
    }

    handleRangeEvent(event, category) {
        const { faction, handleFactionAction } = this.props
        handleFactionAction('CHANGE_BUDGET', {
            faction,
            category,
            value: (Number(event.target.value) / 100).toPrecision(2)
        })
    }

    handleLockEvent(event, category) {
        const { faction, handleFactionAction } = this.props
        handleFactionAction('CHANGE_BUDGET_LOCKED', {
            faction,
            category,
            value: event.target.checked 
        })
    }

    render() {
        const { faction, closeWindow, towns, handleFactionAction } = this.props
        const allocatedBudget = faction.calcuateAllocatedBudget(towns.filter(town => town.faction === faction))

        const budgetKeys = Object.keys(faction.budget.store)

        return (
            <Window title={faction.name} buttons={[{ text: 'close', clickFunction: closeWindow }]}>
                <h2>budget</h2>
                <p>Total revenue: {allocatedBudget.totalTrade}</p>

                <table>
                    <tbody>
                        {budgetKeys.map(category => (
                            <tr key={`row-${category}`}>
                                <th>{category}</th>
                                <td style={{width:'3rem'}}>{faction.budget.displayPercentage[category]}</td>
                                <td>
                                    <input type="range" min="0" max="100"
                                        onChange={event => this.handleRangeEvent(event, category)}
                                        value={faction.budget[category] * 100} />
                                </td>
                                <td>
                                    <input type="checkbox" 
                                    checked={faction.budget.locked[category]}
                                    onChange={event => this.handleLockEvent (event, category)} />
                                </td>
                                <td>{allocatedBudget[category]} / turn</td>
                            </tr>
                        ))}

                    </tbody>
                </table>


            </Window>
        )
    }
}