import { Town } from "../../lib/game-entities/Town"
import SvgIcon from "../SvgIcon"
import styles from "./tradeReport.module.scss"


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

export default function TradeReport(props: {
    town: Town
    townView: boolean
    separateLines: boolean
    inRevolt: boolean
}) {

    const { town, townView, separateLines, inRevolt } = props
    const allocatedBudget = town.faction.allocateTownRevenue(town)

    const articleClassList = [townView ? styles.articleTownView : styles.articleOneLine]


    return <article className={articleClassList.join(" ")}>

        {inRevolt && (
            <span className={styles.revoltMessage}>in revolt</span>
        )}

        {separateLines
            ? <>
                <p>
                    {allocatedBudget.treasury >= town.buildingMaintenanceCost
                        ? renderRowOrNumberOf(20, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins')
                        : renderRowOrNumberOf(20, town.buildingMaintenanceCost - allocatedBudget.treasury, 'coins', 'red')
                    }
                </p>
                <p>
                    {renderRowOrNumberOf(20, allocatedBudget.research, 'lightBulb')}
                </p>
                <p>
                    {renderRowOrNumberOf(20, allocatedBudget.entertainment, 'cocktail')}
                </p>
            </>
            : <>
                {allocatedBudget.treasury >= town.buildingMaintenanceCost
                    ? renderRowOrNumberOf(0, allocatedBudget.treasury - town.buildingMaintenanceCost, 'coins')
                    : renderRowOrNumberOf(0, town.buildingMaintenanceCost - allocatedBudget.treasury, 'coins', 'red')
                }
                {renderRowOrNumberOf(0, allocatedBudget.research, 'lightBulb')}
                {renderRowOrNumberOf(0, allocatedBudget.entertainment, 'cocktail')}
            </>
        }


    </article>

}