import Window from "./Window";
import SvgIcon from "./SvgIcon"
import TradeReport from "./TradeReport"
import CitizenRow from "./CitizenRow";

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

    renderBudgetIcon(category) {
        switch (category) {
            case 'treasury': return <SvgIcon iconName="coins" />
            case 'research': return <SvgIcon iconName="lightBulb" />
            case 'entertainment': return <SvgIcon iconName="cocktail" />
            default: return (null)
        }
    }

    renderTownRevenueRow(town) {
        const { faction } = this.props
        const allocatedBudget = faction.allocateTownRevenue(town)


        return (
            <tr key={`costs-list=${town.indexNumber}`}>
                <td>{town.name}</td>
                <td>{town.output.tradeYield}</td>
                <td>{allocatedBudget.treasury}</td>
                <td>{allocatedBudget.research}</td>
                <td>{allocatedBudget.entertainment}</td>
                <td>{town.buildingMaintenanceCost}</td>
            </tr>
        )
    }

    render() {
        const { faction, closeWindow, towns } = this.props
        const factionTowns = towns.filter(town => town.faction === faction)
        const allocatedBudget = faction.calcuateAllocatedBudget(factionTowns)
        const budgetKeys = Object.keys(faction.budget.store)

        const totalMaintenanceCosts = faction.calculateTotalMaintenceCost(factionTowns)

        return (
            <Window title={faction.name} buttons={[{ text: 'close', clickFunction: closeWindow }]}>
                <h2>budget</h2>
                <p>Total revenue: {allocatedBudget.totalTrade}</p>

                <table>
                    <tbody>
                        {budgetKeys.map(category => (
                            <tr key={`row-${category}`}>
                                <th>{category}</th>
                                <td style={{ width: '3rem' }}>{faction.budget.displayPercentage[category]}</td>
                                <td>
                                    <input type="range" min="0" max="100"
                                        onChange={event => this.handleRangeEvent(event, category)}
                                        value={faction.budget[category] * 100} />
                                </td>
                                <td>
                                    <input type="checkbox"
                                        checked={faction.budget.locked[category]}
                                        onChange={event => this.handleLockEvent(event, category)} />
                                </td>
                                <td style={{ minWidth: '6rem', textAlign: 'right' }}>{allocatedBudget[category]}{this.renderBudgetIcon(category)} / turn</td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                <table>
                    <tbody>
                        {factionTowns.map(town =>
                            <tr key={`trade-report-${town.indexNumber}`}>
                                <td>{town.name}</td>
                                <td><TradeReport town={town}/></td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </Window>
        )
    }
}