import { techDiscoveries, TechDiscovery } from '../lib/game-entities/TechDiscovery.tsx'

import styles from './dialogue.module.scss'

export default class ChooseResearchGoalDialogue extends React.Component {


    renderChoices(techDiscoveryChoices) {
        const { activeFaction, handleDialogueButton } = this.props

        return techDiscoveryChoices.map(techDiscovery => (
            <button
                key={`button-tech-${techDiscovery.name}`}
                onClick={() => { handleDialogueButton('CHOOSE_RESEARCH_GOAL', { activeFaction, techDiscovery }) }}
            >
                {techDiscovery.description}
            </button>
        ))
    }


    render() {
        const { activeFaction } = this.props
        const techDiscoveryChoices = activeFaction.possibleResearchGoals

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <p>{activeFaction.name} must choose a tech</p>
                    <section>

                        {this.renderChoices(techDiscoveryChoices)}

                    </section>
                </div>
            </aside>
        )
    }

}