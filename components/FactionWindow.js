import Window from "./Window";

export default class FactionWindow extends React.Component {
    render() {
        const {faction, closeWindow, towns} =this.props
        const allocatedBudget = faction.calcuateAllocatedBudget(towns.filter(town => town.faction === faction))

        return (
            <Window title={faction.name} buttons={[{ text: 'close', clickFunction: closeWindow }]}>
                <h2>budget</h2>
                <p>Total revenue: {allocatedBudget.totalTrade}</p>
                
                <table>
                    <tr>
                        <th>Treasury</th>
                        <td>{faction.budget.treasury*100}%</td>
                        <td>{allocatedBudget.treasury} per turn</td>
                    </tr>
                    <tr>
                        <th>Research</th>
                        <td>{faction.budget.research*100}%</td>
                        <td>{allocatedBudget.research} per turn</td>
                    </tr>
                    <tr>
                        <th>Entertainment</th>
                        <td>{faction.budget.entertainment*100}%</td>
                        <td>{allocatedBudget.entertainment} per turn</td>
                    </tr>
                </table>

            </Window>
        )
    }
}