import UnitFigure from './UnitFigure';
import styles from './unitListBox.module.scss'



export default function UnitListBox(props) {
    const { units, handleClickOnUnit } = props

    return (
        <article className={styles.box}>
            <ul className={styles.list}>
                {units.map(unit => (
                    <li key={unit.indexNumber} 
                        className={handleClickOnUnit ? [styles.item, styles.clickable].join(" ") : styles.item} 
                        onClick={ handleClickOnUnit ? () => {handleClickOnUnit(unit)} : null }>
                        <UnitFigure unit={unit} inInfoRow />
                    </li>
                ))}
            </ul>
        </article>
    )

}