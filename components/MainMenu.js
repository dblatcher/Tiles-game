import Link from 'next/link'
import dialogueStyles from './dialogue.module.scss'
import styles from './mainMenu.module.scss'

import makeGameState from '../lib/makeGameState'

export default class MainMenu extends React.Component {

    constructor(props) {
        super(props)

        this.saveGame = this.saveGame.bind(this)
        this.loadGame = this.loadGame.bind(this)
        this.newGame = this.newGame.bind(this)
    }

    saveGame() {
        const { storageAction, setOpenFunction } = this.props
        setOpenFunction(false)
        storageAction("SAVE_GAME")
    }

    loadGame() {
        const { storageAction, setOpenFunction } = this.props
        setOpenFunction(false)
        storageAction("LOAD_GAME")
    }

    newGame() {
        const { storageAction, setOpenFunction } = this.props
        const data = makeGameState.test()
        setOpenFunction(false)
        storageAction("NEW_GAME", data)
    }

    render() {
        const { setOpenFunction, noActiveGame } = this.props

        const asideStyle = noActiveGame
            ? styles.background
            : dialogueStyles.dialogueHolder
        const navStyle = noActiveGame
            ? styles.frame
            : dialogueStyles.dialogueFrame

        return <>
            <aside className={asideStyle}>
                <nav className={navStyle}>

                    {noActiveGame ? (
                        <header>
                            <h1>Single Player</h1>
                        </header>
                    ) : (
                        <header className={dialogueStyles.headerRow}>
                            <h2>Menu</h2>
                            <button onClick={setOpenFunction}
                                className={dialogueStyles.button}>
                                close
                            </button>
                        </header>
                    )}

                    <section className={dialogueStyles.buttonRow}>
                        {noActiveGame ? null : (
                            <button className={dialogueStyles.button} onClick={this.saveGame}>save game</button>
                        )}
                        <button className={dialogueStyles.button} onClick={this.loadGame}>load game</button>
                        <button className={dialogueStyles.button} onClick={this.newGame}>new game</button>
                    </section>

                    <Link href="/"><a>Back to home page</a></Link>

                </nav>
            </aside>
        </>
    }
}