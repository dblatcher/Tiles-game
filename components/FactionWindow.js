import Window from "./Window";

export default class FactionWindow extends React.Component {
    
    constructor(props) {
        super(props)

        this.handleRangeEvent = this.handleRangeEvent.bind(this)
    }

    handleRangeEvent(event, category) {
        const { faction, handleFactionAction } = this.props
        handleFactionAction('CHANGE_BUDGET', { 
            faction, 
            category, 
            value: (Number(event.target.value)/100).toPrecision(2) 
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
                                <td>{faction.budget.displayPercentage[category]}</td>
                                <td>{allocatedBudget[category]} per turn</td>
                                <td>[{faction.budget.locked[category] ? 'locked' : 'not locked'}]</td>
                                <td >{faction.budget[category]}</td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td>{faction.budget['treasury'] +faction.budget['research'] + faction.budget['entertainment']}</td>
                        </tr>
                    </tbody>
                </table>

                {budgetKeys.map(category => (
                    <div key={`range-${category}`}>
                        <input type="range" min="0" max="100" 
                        onChange={(event)=>this.handleRangeEvent(event,category)}
                        value={faction.budget[category]*100}/>
                    </div>
                ))}


            </Window>
        )
    }
}