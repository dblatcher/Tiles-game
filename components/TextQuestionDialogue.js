import styles from './dialogue.module.scss'

export default class TextQuestionDialogue extends React.Component {

    constructor(props) {
        super (props)

        this.inputRef = React.createRef()
    }

    getInputValue() {
        return this.inputRef.current.value
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.inputRef.current.focus()
        }
    }

    render() {
        const { textQuestion, handleDialogueButton } = this.props
        const { questionText, answerHandler, cancelHandler } = textQuestion

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <p>{questionText}</p>

                    <input type="text" 
                    ref={this.inputRef}/>

                    <div className={styles.buttonRow}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                handleDialogueButton("EXECUTE_STATE_FUNCTION", cancelHandler)
                            }}>
                            cancel
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                handleDialogueButton("EXECUTE_STATE_FUNCTION", answerHandler(this.getInputValue()))
                            }}>
                            confirm
                        </button>
                    </div>
                </div>
            </aside>
        )
    }
}