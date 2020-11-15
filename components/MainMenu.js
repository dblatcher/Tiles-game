import Link from 'next/link'
import dialogueStyles from './dialogue.module.scss'
import styles from './mainMenu.module.scss'

import makeGameState from '../lib/makeGameState'
import * as Storage from '../lib/storage'

const savedGameFolder = "TILE_SAVES"

export default class MainMenu extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            saveFileNames: [],
            saveAsInputValue: "",
        }

        this.saveGame = this.saveGame.bind(this)
        this.saveAs = this.saveAs.bind(this)
        this.loadGame = this.loadGame.bind(this)
        this.newGame = this.newGame.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
    }

    componentDidMount() {
        this.setState({ saveFileNames: Storage.getItemNames(savedGameFolder) })
    }

    handleTextChange(event) {
        this.setState({
            saveAsInputValue: event.target.value
        })
    }

    saveAs() {
        return this.saveGame(this.state.saveAsInputValue)
    }

    saveGame(itemName) {
        const { storageAction } = this.props
        const { saveFileNames } = this.state

        if (!itemName) {
            let gameNumber = 0
            while (!itemName) {
                if (!saveFileNames.includes(`GAME_${gameNumber}`)) {
                    itemName = `GAME_${gameNumber}`
                }
                gameNumber++
            }
        }

        storageAction("SAVE_GAME", { savedGameFolder, itemName })
        this.setState({ saveFileNames: Storage.getItemNames(savedGameFolder) })
    }

    loadGame(itemName) {
        const { storageAction } = this.props
        if (!itemName) { return false }
        storageAction("LOAD_GAME", { savedGameFolder, itemName })
    }

    deleteGame(itemName) {
        if (!itemName) { return false }
        Storage.clear(savedGameFolder, itemName)
        this.setState({ saveFileNames: Storage.getItemNames(savedGameFolder) })
    }

    newGame(makeStateFunction = makeGameState.randomWorld) {
        const { storageAction } = this.props
        const data = makeStateFunction()
        storageAction("NEW_GAME", { data })
    }

    render() {
        const { setOpenFunction, noActiveGame, browserSupportsLocalStorage } = this.props
        const { saveFileNames } = this.state

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
                        <button className={dialogueStyles.button} onClick={() => {this.newGame(makeGameState.randomWorld)}}>new game</button>
                        <button className={dialogueStyles.button} onClick={() => {this.newGame(makeGameState.test)}}>test world</button>
                    </section>

                    {browserSupportsLocalStorage
                        ? (<>
                            {noActiveGame ? null : (
                                <section className={dialogueStyles.buttonRow}>
                                    <button className={dialogueStyles.button} onClick={this.saveAs}>save as</button>
                                    <input type="text"
                                        value={this.state.saveAsInputValue}
                                        onChange={this.handleTextChange} />
                                </section>
                            )}

                            <section>
                                <h3>Saved Games:</h3>
                                {saveFileNames.map(fileName => (
                                    <div className={dialogueStyles.buttonRow} key={`file-buttons-${fileName}`}>
                                        <span className={dialogueStyles.buttonRowLabel}>{fileName}</span>
                                        <button className={dialogueStyles.button}
                                            onClick={() => { this.loadGame(fileName) }}>load</button>
                                        {noActiveGame
                                            ? null
                                            : (<button className={dialogueStyles.button}
                                                onClick={() => { this.saveGame(fileName) }}>save</button>
                                            )}
                                        <button className={dialogueStyles.button}
                                            onClick={() => { this.deleteGame(fileName) }}>delete</button>
                                    </div>
                                ))}
                            </section>

                        </>) : (
                            <p>Browser does not support local storage</p>
                        )
                    }


                    <Link href="/"><a>Back to home page</a></Link>

                </nav>
            </aside>
        </>
    }
}