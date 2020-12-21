import React from 'react'
import Tile from './Tile'
import SvgIcon from './SvgIcon'
import UnitFigure from './UnitFigure'
import styles from './infoBar.module.scss'
import InfoLink from './InfoLink'
import { displayTurnsToComplete, getTurnsToComplete } from '../lib/utility'



export default class InfoBar extends React.Component {


    render() {
        const {stateOfPlay, centerWindowOn, toggleFactionWindow, watchingFaction} = this.props;
        const { selectedSquare, selectedUnit, activeFaction, towns, interfaceMode } = stateOfPlay;

        const activeFactionTowns = towns.filter(town => town.faction === activeFaction)
        const factionTownsNotInRevolt = activeFactionTowns.filter(town => !town.getIsInRevolt(stateOfPlay.units))

        const allocatedBudget = activeFaction
            ? activeFaction.calcuateAllocatedBudget(factionTownsNotInRevolt, false)
            : null

        const treasuryChange = activeFaction
            ? allocatedBudget.treasury - activeFaction.calculateTotalMaintenceCost(activeFactionTowns)
            : 0

        const turnsToNextBreakthrough = getTurnsToComplete(activeFaction.researchGoal.researchCost - activeFaction.research, allocatedBudget.research)  

        const visibleSelectedSquare = selectedSquare 
            ? watchingFaction.worldMap && watchingFaction.worldMap[selectedSquare.y] 
                ? watchingFaction.worldMap[selectedSquare.y][selectedSquare.x] 
                : null
            : null;

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
                            <span>{displayTurnsToComplete(turnsToNextBreakthrough)}</span>
                            <span>{activeFaction.budget.displayPercentage.research}</span>
                        </p>
                    </article>)
                    : null}

                {selectedUnit && interfaceMode == 'MOVE' ? (<>
                    <article className={styles.infoBlock}
                        onClick={() => { centerWindowOn(selectedUnit) }}>
                        <UnitFigure unit={selectedUnit} inInfoRow />

                        <ul className={styles.infoList}>
                            
                            {selectedUnit.infoList.map((infoPoint, index) => (
                                <li className={styles.infoLine} key={`selectedUnitInfo#${index}`}>
                                    {infoPoint}
                                    {index == 0 ? <InfoLink subject={selectedUnit}/> :null}
                                </li>
                            ))}
                        </ul>
                    </article>
                </>) : (null)}

                {visibleSelectedSquare && interfaceMode == 'VIEW' ? (<>
                    <article className={styles.infoBlock}>
                        <Tile mapSquare={visibleSelectedSquare} inInfoRow showYields />
                        <ul className={styles.infoList}>
                            {visibleSelectedSquare.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>{infoPoint}</li>)}
                        </ul>

                    </article>
                </>) : (null)}

            </section>
        )
    }
}