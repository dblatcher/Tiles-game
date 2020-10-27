import React from 'react'
import Tile from './Tile'
import SvgIcon from './SvgIcon'
import UnitFigure from './UnitFigure'
import styles from './infoBar.module.scss'



export default class InfoBar extends React.Component {


    render() {
        const { selectedSquare, selectedUnit, scrollToSquare, activeFaction, towns,toggleFactionWindow } = this.props;
        const allocatedBudget = activeFaction.calcuateAllocatedBudget(towns.filter(town => town.faction === activeFaction))
        

        return (
            <section className={styles.infoRow}>

                <article className={styles.factionBlock} onClick={toggleFactionWindow}>

                    <p>
                        {activeFaction.name}
                    </p>
                    <p>
                        <span><SvgIcon color="goldenrod" iconName="coins" />{activeFaction.treasury}</span>
                        <span>{`(${allocatedBudget.treasury >= 0 ? '+' : ''}${allocatedBudget.treasury})`}</span>
                        <span>{activeFaction.budget.displayPercentage.treasury}</span>
                    </p>
                    <p>
                        <span><SvgIcon color="skyblue" iconName="lightBulb" />{activeFaction.research}</span>
                        <span>{`(${allocatedBudget.research >= 0 ? '+' : ''}${allocatedBudget.research})`}</span>
                        <span>{activeFaction.budget.displayPercentage.research}</span>
                    </p>

                </article>

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