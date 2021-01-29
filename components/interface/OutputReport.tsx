import { Town } from "../../lib/game-entities/Town"
import SvgIcon from "../SvgIcon"
import styles from "./OutputReport.module.scss"

interface YieldReportProps {
    town: Town
    townView: boolean
    separateLines: boolean
    inRevolt: boolean
    topic: "TRADE" | "YIELD" | "BOTH"
}

function renderRowOrNumberOf(maxForRow: number, number: number, iconName: string, color: string | undefined = undefined) {
    if (number <= maxForRow && number > 0) {
        let keyArray: string[] = []
        for (let i = 0; i < number; i++) {
            keyArray.push(`icon-${i}`)
        }
        return keyArray.map(key => <SvgIcon key={key} iconName={iconName} color={color} />)
    }
    return <span className={styles.iconAndNumber}>
        <SvgIcon iconName={iconName} color={color} />
        &times; {number}
    </span>
}

function renderOutputReport(props: YieldReportProps) {
    const { town, separateLines } = props
    const allocatedBudget = town.faction.allocateTownRevenue(town)

    return separateLines
        ? <>
            <p>{allocatedBudget.treasury >= town.buildingMaintenanceCost
                ? renderRowOrNumberOf(20, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins')
                : renderRowOrNumberOf(20, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins', 'red')
            }</p>
            <p>{renderRowOrNumberOf(20, allocatedBudget.research, 'lightBulb')}</p>
            <p>{renderRowOrNumberOf(20, allocatedBudget.entertainment, 'cocktail')}</p>
        </>
        : <>
            {allocatedBudget.treasury >= town.buildingMaintenanceCost
                ? renderRowOrNumberOf(0, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins')
                : renderRowOrNumberOf(0, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins', 'red')
            }
            {renderRowOrNumberOf(0, allocatedBudget.research, 'lightBulb')}
            {renderRowOrNumberOf(0, allocatedBudget.entertainment, 'cocktail')}
        </>
}

function renderYieldReport(props: YieldReportProps) {
    const { town, separateLines } = props
    const { output } = town

    return separateLines
        ? <>
            <p>{renderRowOrNumberOf(20, output.foodYield, 'food')}</p>
            <p>{renderRowOrNumberOf(20, output.productionYield, 'production')}</p>
            <p>{renderRowOrNumberOf(20, output.tradeYield, 'trade')}</p>
        </>
        : <>
            {renderRowOrNumberOf(0, output.foodYield, 'food', output.foodYield < 0 ? 'red' : undefined)}
            {renderRowOrNumberOf(0, output.productionYield, 'production', output.productionYield < 0 ? 'red' : undefined)}
            {renderRowOrNumberOf(0, output.tradeYield, 'trade')}
        </>
}

export default function YieldReport(props: YieldReportProps) {
    const { townView, inRevolt } = props
    const articleClassList = [townView ? styles.articleTownView : styles.articleOneLine]

    return <article className={articleClassList.join(" ")}>

        {inRevolt && (
            <span className={styles.revoltMessage}>in revolt</span>
        )}

        {(props.topic === 'TRADE' || props.topic === "BOTH") && renderOutputReport(props)}
        {(props.topic === 'YIELD' || props.topic === "BOTH") && renderYieldReport(props)}

    </article>
}