import { Unit } from '../../lib/game-entities/Unit';
import UnitFigure from '../UnitFigure';
import styles from './listBox.module.scss'



export default function UnitListBox(props: {
    units: Unit[]
    handleClickOnUnit?: Function
    onTownView?: boolean
}) {
    const { units, handleClickOnUnit=null, onTownView=false } = props

    const articleClassList = [styles.box]
    if (onTownView) {articleClassList.push(styles.onTownView)}

    const listClassList = [styles.list, styles.units]


    return (
        <article className={articleClassList.join(" ")}>
            <ul className={listClassList.join(" ")}>
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