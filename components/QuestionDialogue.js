import styles from './dialogue.module.scss'

export default class QuestionDialogue extends React.Component {

    constructor(props) {
        super(props)

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
        const { question, handleDialogueButton } = this.props
        const { questionText, answerHandler, cancelHandler, options, type } = question

        return (
            <aside className={styles.dialogueHolder}>
                <div className={styles.dialogueFrame}>

                    <p>{questionText}</p>

                    {type === 'TextQuestion' ? (<>
                        <input type="text"
                            ref={this.inputRef} />

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
                    </>) : null}

                    {type === 'OptionsQuestion' ? (<>
                        <div className={styles.buttonRow}>

                            {options.map((option, index) => (
                                <button className={styles.button} key={`option-${index}`}
                                    onClick={() => {
                                        handleDialogueButton("EXECUTE_STATE_FUNCTION", option.handler )
                                    }}>
                                    {option.label}
                                </button>
                            ))}

                        </div>
                    </>) : null}

                </div>
            </aside>
        )
    }
}