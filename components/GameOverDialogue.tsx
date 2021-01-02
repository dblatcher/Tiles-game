import React from 'react'
import { Faction } from '../lib/game-entities/Faction'
import { GameState } from '../lib/game-entities/GameState'
import styles from './dialogue.module.scss'

import { getUnitScore, getCitizenScore, getTechScore, getTotalScore } from '../lib/game-misc/scoring'

import UnitListBox from './interface/UnitListBox'
import TechListBox from './interface/TechListBox'
import CitizenListBox from './interface/CitizenListBox'

class GameOverType {
    id: string
    title: string
    descriptionFormat: string
    isVictory: boolean
}

const GameOverTypes: GameOverType[] = [
    {
        id: 'CONQUEST',
        title: 'Conquest Victory!',
        descriptionFormat: '%FACTION% has eliminated all rivals and conquered the world. All hail %FACTION%!',
        isVictory: true
    },
    {
        id: 'DEATH',
        title: 'Eliminated...',
        descriptionFormat: '%FACTION% has been wiped off the face of the map.',
        isVictory: false
    },
]

export default class GameOverDialogue extends React.Component {
    props: {
        stateOfPlay: GameState
        watchingFaction: Faction
        reset: Function
    }

    renderScore(scoreFunction) {
        const { stateOfPlay, watchingFaction } = this.props

        return <b>{scoreFunction(watchingFaction, stateOfPlay)} points</b>
    }

    render() {
        const { stateOfPlay, watchingFaction, reset } = this.props
        const renderScore = this.renderScore.bind(this)

        const watchingPlayerWon = watchingFaction ? watchingFaction.checkIfAlive(stateOfPlay) : undefined
        const gameOverType = watchingPlayerWon ? GameOverTypes[0] : GameOverTypes[1]
        const description = gameOverType.descriptionFormat.replace(/%FACTION%/g, watchingFaction.name)

        const population = []
        if (watchingFaction) {
            stateOfPlay.towns
                .filter(town => town.faction === watchingFaction)
                .forEach(town => population.push(...town.citizens))
        }

        if (watchingFaction && gameOverType.isVictory) {

        }

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <h2>{gameOverType.title}</h2>
                    <p>{description}</p>

                    {gameOverType.isVictory && (<>
                        <h3>Units: {renderScore(getUnitScore)}</h3>
                        <UnitListBox units={stateOfPlay.units.filter(unit => unit.faction === watchingFaction)} />

                        <h3>Discoveries: {renderScore(getTechScore)}</h3>
                        <TechListBox techList={watchingFaction.knownTech} />

                        <h3>Citizens: {renderScore(getCitizenScore)}</h3>
                        <CitizenListBox citizens={population} />

                        <h3>
                            Total:{renderScore(getTotalScore)}
                        </h3>

                    </>)}

                    <div className={styles.buttonRow}>

                        <div className={styles.button}
                            onClick={() => { reset() }}
                        >
                            <span>End Game</span>
                        </div>
                    </div>

                </div>
            </aside>
        )

    }
}