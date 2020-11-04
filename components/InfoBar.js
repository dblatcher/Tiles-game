import React from 'react'
import Tile from './Tile'
import SvgIcon from './SvgIcon'
import UnitFigure from './UnitFigure'
import styles from './infoBar.module.scss'



export default class InfoBar extends React.Component {


    render() {
        const { selectedSquare, selectedUnit, scrollToSquare, activeFaction, towns, toggleFactionWindow } = this.props;
        
        const activeFactionTowns = towns.filter(town => town.faction === activeFaction)

        const allocatedBudget = activeFaction 
            ? activeFaction.calcuateAllocatedBudget(activeFactionTowns)
            : null


        const treasuryChange = activeFaction
         ? allocatedBudget.treasury - activeFaction.calculateTotalMaintenceCost(activeFactionTowns)
         : 0

        return (
            <section className={styles.infoRow}>

                {activeFaction ? (
                    <article className={styles.factionBlock} onClick={toggleFactionWindow}>

                        <p>
                            {activeFaction.name}
                        </p>
                        <p>
                            <span><SvgIcon iconName="coins" />{activeFaction.treasury}</span>
                            <span>{`(${treasuryChange >= 0 ? '+' : ''}${treasuryChange})`}</span>
                            <span>{activeFaction.budget.displayPercentage.treasury}</span>
                        </p>
                        <p>
                            <span><SvgIcon iconName="lightBulb" />{activeFaction.research}</span>
                            <span>{`(${allocatedBudget.research >= 0 ? '+' : ''}${allocatedBudget.research})`}</span>
                            <span>{activeFaction.budget.displayPercentage.research}</span>
                        </p>
                    </article>)
                    : null}

                <article className={styles.infoBlock}
                    onClick={() => { scrollToSquare(selectedUnit) }}>
                    {selectedUnit ? (<>
                        <UnitFigure unit={selectedUnit} inInfoRow />

                        <ul className={styles.infoList}>
                            {selectedUnit.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedUnitInfo#${index}`}>{infoPoint}</li>)}
                        </ul>
                    </>) : (null)}
                </article>

                <article className={styles.infoBlock}>
                    {selectedSquare ? (<>
                        <Tile mapSquare={selectedSquare} inInfoRow showYields />
                        <ul className={styles.infoList}>
                            {selectedSquare.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>{infoPoint}</li>)}
                        </ul>

                    </>) : (null)}
                </article>

            </section>
        )
    }
}