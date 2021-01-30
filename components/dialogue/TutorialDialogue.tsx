import React from 'react'
import { GameState } from '../../lib/game-entities/GameState'
import { TutorialState } from '../../lib/game-misc/tutorial'

import styles from './tutorialDialogue.module.scss'
import dialogueStyles from '../../styles/dialogue.module.scss'

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


        const buttonClassList = [dialogueStyles.button, dialogueStyles.rightAligned]
        const messageClassList = [styles.message]
        if (showing) {
            buttonClassList.push(dialogueStyles.topRightSpaced)
        } else {
            messageClassList.push(styles.folded)
        }

        const messageContent = (message && message.text && message.text.english)
            ? message.text.english
            : "[MISSING CONTENT]"

        return (

            <aside className={dialogueStyles.nonBlockingDialogueHolder}>
                <div className={[dialogueStyles.dialogueFrame, dialogueStyles.tutorial].join(" ")}>

                    <button onClick={() => { handleTutorialClick(showing ? 'DISMISS' : 'SHOW') }}
                        className={buttonClassList.join(" ")}
                    >
                        <i className={"material-icons md-18"}>{showing ? 'expand_less' : 'school'}</i>
                    </button>

                    <p className={messageClassList.join(" ")}>{messageContent}</p>
                </div>
            </aside>

        )

    }
}