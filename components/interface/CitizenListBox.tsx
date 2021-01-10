import { Citizen } from '../../lib/game-entities/Citizen';
import styles from './listBox.module.scss'



export default function CitizenListBox(props: {
    citizens: Citizen[]
    onTownView?: boolean
}) {
    const { citizens, onTownView = false } = props

    const articleClassList = [styles.box]
    if (onTownView) { articleClassList.push(styles.onTownView) }

    const listClassList = [styles.list, styles.citizens]

    return (
        <article className={articleClassList.join(" ")}>
            <ul className={listClassList.join(" ")}>
                {citizens.map((citizen, index) => (
                    <li key={`citizen=${index}`}>
                        <i
                            className={[].join(" ")}
                            style={ citizen.job.spriteStyle}
                        />
                    </li>
                ))}
            </ul>
        </article>
    )

}