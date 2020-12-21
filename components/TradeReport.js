import IconRow from "./IconRow"
import styles from "./tradeReport.module.scss"

export default function TradeReport(props) {

    const { town, townView, includeName, separateLines, inRevolt } = props
    const allocatedBudget = town.faction.allocateTownRevenue(town)

    const articleClassList = [townView ? styles.articleTownView : styles.articleOneLine]


    return <article className={articleClassList.join(" ")}>
        {includeName ? (<p className={styles.name}>{town.name}:&nbsp;</p>) : null}

        {inRevolt && (
            <span className={styles.revoltMessage}>in revolt</span>
        )}

        {separateLines
            ? <>
                <p>
                    {allocatedBudget.treasury >= town.buildingMaintenanceCost
                        ? <>
                            <IconRow iconName={'coins'} number={allocatedBudget.treasury - town.buildingMaintenanceCost} />
                            <IconRow iconName={'coins'} color="gray" number={town.buildingMaintenanceCost} />
                        </>
                        : <>
                            <IconRow iconName={'coins'} color="red" number={town.buildingMaintenanceCost - allocatedBudget.treasury} />
                        </>}
                </p>
                <p>
                    <IconRow iconName={'lightBulb'} number={allocatedBudget.research} />
                </p>
                <p>
                    <IconRow iconName={'cocktail'} number={allocatedBudget.entertainment} />
                </p>
            </>
            : <>
                {allocatedBudget.treasury >= town.buildingMaintenanceCost
                    ? <>
                        <IconRow iconName={'coins'} number={allocatedBudget.treasury - town.buildingMaintenanceCost} />
                        <IconRow iconName={'coins'} color="gray" number={town.buildingMaintenanceCost} />
                    </>
                    : <>
                        <IconRow iconName={'coins'} color="red" number={town.buildingMaintenanceCost - allocatedBudget.treasury} />
                    </>}
                <IconRow iconName={'lightBulb'} number={allocatedBudget.research} />
                <IconRow iconName={'cocktail'} number={allocatedBudget.entertainment} />
            </>
        }


    </article>

}