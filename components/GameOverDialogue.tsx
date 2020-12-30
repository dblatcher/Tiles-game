import React from 'react'
import { Faction } from '../lib/game-entities/Faction'
import { GameState } from '../lib/game-entities/GameState'
import styles from './dialogue.module.scss'

export default class GameOverDialogue extends React.Component {
    props: {
        stateOfPlay: GameState
        watchingFaction: Faction
        reset: Function
    }

    render() {
        const { stateOfPlay, watchingFaction, reset } = this.props

        const watchingPlayerWon = watchingFaction ? watchingFaction.checkIfAlive(stateOfPlay) : undefined

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <p>GAME OVER</p>
                    <p>{watchingPlayerWon ? 'you won' : 'you lost'}</p>

                    <div className={styles.button}
                        onClick={() => { reset() }}
                    >
                        <span>End Game</span>
                    </div>

                </div>
            </aside>
        )

    }
}