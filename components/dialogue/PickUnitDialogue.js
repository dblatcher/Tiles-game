import styles from '../../styles/dialogue.module.scss'
import UnitFigure from '../UnitFigure'
export default function PickUnitDialogue(props) {
    const { units, handleDialogueButton } = props

    const options = units.map(unit => (

        <article className={styles.unitBlock} key={`pick-${unit.indexNumber}`} onClick={() => handleDialogueButton("PICK_UNIT", { unit })}>

            <UnitFigure unit={unit} inInfoRow />

            <ul className={styles.infoList}>
                {unit.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`pick-${unit.indexNumber}-Info#${index}`}>{infoPoint}</li>)}
            </ul>
        </article>

    ))

    return (
        <aside className={styles.dialogueHolder}>
            <div className={styles.pickUnitsDialogue}>
                {options}

                <button className={styles.button} onClick={() => handleDialogueButton("PICK_UNIT", {}) }>exit</button>
            </div>
        </aside>
    )
}