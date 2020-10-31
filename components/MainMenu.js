import Link from 'next/link'
import dialogueStyles from './dialogue.module.scss'

export default class MainMenu extends React.Component {

    constructor(props) {
        super(props)

        this.saveGame = this.saveGame.bind(this)
        this.loadGame = this.loadGame.bind(this)
    }

    saveGame() {
        const { storageAction, toggle } = this.props
        toggle()
        storageAction("SAVE_GAME")
    }

    loadGame() {
        const { storageAction, toggle } = this.props
        toggle()
        storageAction("LOAD_GAME")
    }

    render() {
        const { toggle } = this.props
        return <>
            <aside className={dialogueStyles.dialogueHolder}>
                <nav className={dialogueStyles.dialogueFrame}>

                    <header className={dialogueStyles.headerRow}>
                        <h2>Menu</h2>
                        <button onClick={toggle}
                            className={dialogueStyles.button}>
                            close
                        </button>
                    </header>

                    <section className={dialogueStyles.buttonRow}>
                        <button className={dialogueStyles.button} onClick={this.saveGame}>save game</button>
                        <button className={dialogueStyles.button} onClick={this.loadGame}>load game</button>
                    </section>

                    <Link href="/"><a>Back to home</a></Link>

                </nav>
            </aside>
        </>
    }
}