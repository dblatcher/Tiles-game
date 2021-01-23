import styles from '../../styles/dialogue.module.scss'
import SvgIcon from '../SvgIcon'
import UnitFigure from '../UnitFigure'

export default class BattleDialogue extends React.Component {

    render() {
        const { battle, cancelBattle, confirmBattle } = this.props
        const { attacker, defenders, mapSquare } = battle

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <section className={styles.unitRow}>

                        <div className={styles.unitBlock}>
                            <div className={styles.scoreSummary}>
                                <p>
                                    {battle.attacker.type.name}:
                                    <SvgIcon iconName={'fistRaised'}/>
                                    {battle.attacker.type.attack}
                                </p>
                                {battle.attack.breakdown.map((item, index) => (
                                    <p key={`attack-breakdown-${index}`}>{item}</p>
                                ))}
                                <p>
                                    total:
                                    <SvgIcon iconName={'fistRaised'}/>
                                    {battle.attack.score}
                                </p>
                            </div>
                            <UnitFigure unit={attacker} inInfoRow />
                        </div>

                        <div className={styles.unitBlock}>
                            <UnitFigure unit={defenders[0]} inInfoRow />
                            <div className={styles.scoreSummary}>

                                <p>
                                    {battle.defenders[0].type.name}:
                                    <SvgIcon iconName={'shield'}/>
                                    {battle.defenders[0].type.defend}
                                </p>

                                {battle.defence.breakdown.map((item, index) => (
                                    <p key={`defend-breakdown-${index}`}>{item}</p>
                                ))}
                                <p>
                                    total:
                                    <SvgIcon iconName={'shield'}/>
                                    {battle.defence.score}
                                </p>
                            </div>
                        </div>
                    </section>

                    <nav className={styles.buttonRow}>
                        <button className={styles.button} onClick={cancelBattle}>cancel</button>
                        <button className={styles.button} onClick={confirmBattle}>attack</button>
                    </nav>
                </div>
            </aside>
        )
    }
}