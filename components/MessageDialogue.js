import styles from './dialogue.module.scss'

export default class MessageDialogue extends React.Component {

    render() {
        const { message, acknowledgeMessage } = this.props
        const { text } = message

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    {text.length > 1
                        ? (
                            <ul className={styles.messageList}>
                                {text.map((line, index) => <li key={index}>{line}</li>)}
                            </ul>
                        )
                        : (
                            <p>{text[0]}</p>
                        )
                    }

                    <div className={styles.buttonRow}>
                        <button className={styles.button} onClick={acknowledgeMessage}>ok</button>
                    </div>
                </div>
            </aside>
        )
    }
}