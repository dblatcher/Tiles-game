import styles from './dialogue.module.scss'
import UnitFigure from './UnitFigure'

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
                                <p>{attacker.type.name}</p>
                                <p>{`${attacker.type.attack} attack`}</p>
                                <p>{`total: ${battle.attackScore}`}</p>
                            </div>
                            <UnitFigure unit={attacker} inInfoRow />
                        </div>

                        <div className={styles.unitBlock}>
                            <UnitFigure unit={defenders[0]} inInfoRow />
                            <div className={styles.scoreSummary}>
                                <p>{defenders[0].type.name}</p>
                                <p>{`${defenders[0].type.defend} defend`}</p>
                                <p>{`total: ${battle.defendScore}`}</p>
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