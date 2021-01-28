import { techDiscoveries, TechDiscovery } from '../../lib/game-entities/TechDiscovery'

import TechTree from '../TechTree';
import styles from '../../styles/dialogue.module.scss'

export default class ChooseResearchGoalDialogue extends React.Component {


    render() {
        const { activeFaction, handleDialogueButton } = this.props

        if (!activeFaction) {
            return (

                <aside className={styles.dialogueHolder}>
                    <div className={styles.dialogueFrame}>ERROR = no activeFaction</div>
                    <button onClick={
                        () => { handleDialogueButton(CHOOSE_RESEARCH_GOAL,{})}
                    }>try clicking this</button>
                </aside>

            )
        };

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <p>Choose a technology for {activeFaction.name} to research</p>

                    <TechTree
                        knownTech={activeFaction.knownTech}
                        possibleResearchGoals={activeFaction.possibleResearchGoals}
                        handleClickOnTech={techDiscovery => { handleDialogueButton('CHOOSE_RESEARCH_GOAL', { activeFaction, techDiscovery }) }}
                    />

                </div>
            </aside>
        )
    }

}