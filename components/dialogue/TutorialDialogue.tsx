import React from 'react'
import { GameState } from '../../lib/game-entities/GameState'
import { TutorialState } from '../../lib/game-misc/tutorial'

import styles from '../../styles/dialogue.module.scss'

export default class TutorialDialogue extends React.Component {
    props: {
        tutorialState: TutorialState
        stateOfPlay: GameState
        handleTutorialClick: Function
    }


    render() {
        if (!this.props.tutorialState) { return null }
        const { handleTutorialClick, stateOfPlay } = this.props
        const { enabled, showing, message, playerFaction } = this.props.tutorialState

        if (!enabled || !message) { return null }
        if (stateOfPlay.activeFaction !== playerFaction) { return null }

        if (!showing) {
            return (
                <aside className={styles.nonBlockingDialogueHolder}>
                    <div className={[styles.dialogueFrame, styles.tutorial].join(" ")}>
                        <button onClick={() => { handleTutorialClick('SHOW') }}>TUTORIAL</button>
                    </div>
                </aside>
            )
        }

        return (

            <aside className={styles.nonBlockingDialogueHolder}>
                <div className={[styles.dialogueFrame, styles.tutorial].join(" ")}>

                    {message && (
                        <p>{message.text.english}</p>
                    )}

                    <button onClick={() => { handleTutorialClick('DISMISS') }}>DISMISS</button>
                </div>

            </aside>

        )

    }
}