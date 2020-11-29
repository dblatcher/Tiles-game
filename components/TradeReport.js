import IconRow from "./IconRow"
import styles from "./tradeReport.module.scss"

export default function TradeReport(props) {

    const { town, townView, includeName, separateLines } = props
    const allocatedBudget = town.faction.allocateTownRevenue(town)

    return <article className={townView ? styles.articleTownView : styles.articleOneLine}>
        {includeName ? (<p className={styles.name}>{town.name}:&nbsp;</p>) : null}

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