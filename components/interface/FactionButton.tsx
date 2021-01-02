import React from 'react'
import { Faction } from '../../lib/game-entities/Faction'
import { GameState } from '../../lib/game-entities/GameState'

import { displayTurnsToComplete, getTurnsToComplete } from '../../lib/utility'
import SvgIcon from '../SvgIcon'

import styles from './factionButton.module.scss'

export default function FactionButton(props: {
    stateOfPlay: GameState
    faction: Faction
    toggleFactionWindow: Function
}) {

    const { stateOfPlay, faction, toggleFactionWindow } = props
    const { towns } = stateOfPlay;

    const activeFactionTowns = towns.filter(town => town.faction === faction)
    const factionTownsNotInRevolt = activeFactionTowns.filter(town => !town.getIsInRevolt(stateOfPlay.units))

    const allocatedBudget = faction
        ? faction.calcuateAllocatedBudget(factionTownsNotInRevolt, false)
        : null

    const treasuryChange = faction
        ? allocatedBudget.treasury - faction.calculateTotalMaintenceCost(activeFactionTowns)
        : 0

    const turnsToNextBreakthrough = faction.researchGoal
        ? getTurnsToComplete(faction.researchGoal.researchCost - faction.research, allocatedBudget.research)
        : 0


    return <article className={styles.holder}
    onClick={() => { toggleFactionWindow ? toggleFactionWindow() : null }}>
        <p className={styles.factionName}>
            {faction.name}
        </p>
        <p className={styles.report}>
            <span><SvgIcon iconName="coins" />{faction.treasury}</span>
            <span>{`(${treasuryChange >= 0 ? '+' : ''}${treasuryChange})`}</span>
            <span>{faction.budget.displayPercentage.treasury}</span>
        </p>
        <p className={styles.report}>
            <span><SvgIcon iconName="lightBulb" /></span>
            <span>{displayTurnsToComplete(turnsToNextBreakthrough)}</span>
            <span>{faction.budget.displayPercentage.research}</span>
        </p>
    </article>
}