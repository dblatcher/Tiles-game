import Window from "./Window";
import SvgIcon from "./SvgIcon"
import TradeReport from "./TradeReport"
import ProgressBox from "./ProgressBox"
import ProductionMenu from "./dialogue/ProductionMenu.tsx"
import TechTree from "./TechTree";
import { displayTurnsToComplete, getTurnsToComplete } from '../lib/utility'
import CitizenRow from "./CitizenRow";

import styles from './factionWindow.module.scss'
import ProgressBar from "./interface/ProgressBar";

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
        const { faction, closeWindow, openTownView, handleTownAction, stateOfPlay } = this.props
        const factionTowns = stateOfPlay.towns.filter(town => town.faction === faction)

        const factionTownsNotInRevolt = factionTowns.filter(town => !town.getIsInRevolt(stateOfPlay.units))

        const allocatedBudget = faction.calcuateAllocatedBudget(factionTownsNotInRevolt, false)
        const allocatedBudgetWithoutSpecialists = faction.calcuateAllocatedBudget(factionTownsNotInRevolt, true)
        const budgetKeys = Object.keys(faction.budget.store)

        const totalMaintenanceCosts = faction.calculateTotalMaintenceCost(factionTowns)
        const turnsToNextBreakthrough = faction.researchGoal
            ? getTurnsToComplete(faction.researchGoal.researchCost - faction.research, allocatedBudget.research)
            : 1

        return (
            <Window title={faction.name} buttons={[{ text: 'close', clickFunction: closeWindow }]}>
                <h2 className={styles.reportHeading}>Budget</h2>

                <article className={[styles.reportTable, styles.budget].join(" ")}>
                    <section className={styles.budget}>
                        <span>{allocatedBudget.totalTrade}<SvgIcon iconName="trade" /> total trade</span>
                        <span>{totalMaintenanceCosts}<SvgIcon iconName="coins" color="red" /> maintenance costs</span>
                    </section>
                    {budgetKeys.map(category => (
                        <section className={styles.budget} key={`reportTable-${category}`}>
                            <h3 className={styles.budget}>{category}</h3>
                            <div>
                                <span style={{ width: '3rem', display: 'inline-block' }}>
                                    {faction.budget.displayPercentage[category]}
                                </span>
                                <span>
                                    <input type="range" min="0" max="100"
                                        onChange={event => this.handleRangeEvent(event, category)}
                                        value={faction.budget[category] * 100} />
                                    <span >
                                        <input type="checkbox"
                                            checked={faction.budget.locked[category]}
                                            onChange={event => this.handleLockEvent(event, category)} />
                                    </span>
                                </span>
                                <span style={{ width: '6rem', display: 'inline-block', textAlign: 'right' }}>
                                    {allocatedBudgetWithoutSpecialists[category]}{this.renderBudgetIcon(category)} / turn
                                </span>
                            </div>
                        </section>
                    ))}
                </article>

                <h2 className={styles.reportHeading}>Towns</h2>

                <article className={[styles.reportTable, styles.town].join(" ")}>
                    {factionTowns.map(town => (
                        <section key={`townReport-${town.indexNumber}`}>
                            <h3 style={{ cursor: 'pointer' }} onClick={() => { openTownView(town) }}>{town.name}</h3>
                            <CitizenRow town={town} onFactionWindow={true} stateOfPlay={stateOfPlay} />
                            <TradeReport town={town} inRevolt={factionTownsNotInRevolt.indexOf(town) === -1} />
                            <ProductionMenu town={town} handleTownAction={handleTownAction}  showProgressBar/>
                        </section>
                    ))}
                </article>


                <h2 className={styles.reportHeading}>Researching {faction.researchGoal ? faction.researchGoal.description : 'nothing'}</h2>
                <section style={{ display: "flex", justifyContent: "space-between", marginBottom: '1em' }}>
                    <p style={{ margin: "0" }}>
                        {faction.researchGoal && (
                            <span>({displayTurnsToComplete(turnsToNextBreakthrough)})</span>
                        )}
                    </p>

                    {faction.researchGoal ? (<>
                        <ProgressBox
                            current={faction.research}
                            target={faction.researchGoal.researchCost}
                            unit={'lightBulb'}
                        />
                    </>) : null}
                </section>

                <TechTree knownTech={faction.knownTech} currentResearchGoal={faction.researchGoal} />
            </Window>
        )
    }
}