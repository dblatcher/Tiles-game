import styles from './dialogue.module.scss'

export default class BattleDialogue extends React.Component {

    render() {
        const {message, acknowledgeMessage} = this.props
        const {text} = message

        return (
        <aside className={styles.dialogueHolder}>
            <div className={styles.dialogueFrame}>

                <p>{text}</p>


                <div className={styles.buttonRow}>
                    <button className={styles.button} onClick={acknowledgeMessage}>ok</button>
                </div>
            </div>
        </aside>
        )
    }
}