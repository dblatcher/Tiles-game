import { Faction } from '../../lib/game-entities/Faction'
import { TechStealQuestion } from '../../lib/game-entities/Questions'
import styles from '../../styles/dialogue.module.scss'
import InfoLink from '../InfoLink'

export default function ChooseStolenTechDialogue(props) {
    const handleDialogueButton: Function = props.handleDialogueButton
    const activeFaction: Faction = props.activeFaction
    const question: TechStealQuestion = props.question
    const { options, questionText } = question

    const techOptions = options.map((techDiscovery, index: number) => (

        <article className={styles.techBlock}
            key={`pick-${index}`}
            
        >
            <div className={styles.button} 
            onClick={() => handleDialogueButton("PICK_STOLEN_TECH", { techDiscovery, activeFaction })}
            >
                <span>{techDiscovery.description}</span>
                <InfoLink subject={techDiscovery} sameWindow={false} useName={false} useDescription={false} text={null} />
            </div>
        </article>

    ))

    return (
        <aside className={styles.dialogueHolder}>
            <div className={styles.pickUnitsDialogue}>
                <p>{questionText}</p>
                {techOptions}
            </div>
        </aside>
    )
}