import UnitFigure from './UnitFigure';
import styles from './unitListBox.module.scss'



export default function UnitListBox(props) {
    const { units, handleClickOnUnit = () => { } } = props

    return (
        <article className={styles.box}>
            <ul className={styles.list}>
                {units.map(unit => (
                    <li key={unit.indexNumber} className={styles.item} onClick={handleClickOnUnit(unit)}>
                        <UnitFigure unit={unit} inInfoRow />
                    </li>
                ))}
            </ul>
        </article>
    )

}