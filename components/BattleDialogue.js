import styles from './battleDialogue.module.scss'

export default class BattleDialogue extends React.Component {

    render() {
        const {battle, cancelBattle} = this.props
        const {attacker, defenders, mapSquare} = battle

        

        return (
        <aside className={styles.dialogueHolder}>
            <div className={styles.dialogueFrame}>

                <p>{`Battle: ${attacker.infoList[0]} attacking ${defenders[0].infoList[0]} on ${mapSquare.description}. `}</p>

                <p>{`${battle.attackScore} vs ${battle.defendScore}`}</p>

                <button onClick={cancelBattle}>cancel</button>
            </div>
        </aside>
        )
    }
}