import UnitFigure from './UnitFigure';
import styles from './supportedUnitsList.module.scss'



export default function SupportedUnitsList (props) {
    const { town } = props

    return (
        <article className={styles.box}>
            <ul className={styles.list}>
                {town.supportedUnits.map(unit => (
                    <li key={unit.indexNumber} className={styles.item}>
                        <UnitFigure unit={unit} inInfoRow/>
                    </li>
                ))}
            </ul>
        </article>
    )

}