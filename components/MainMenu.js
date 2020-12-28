import Link from 'next/link'
import dialogueStyles from './dialogue.module.scss'
import styles from './mainMenu.module.scss'

import makeGameStateFunction from '../lib/makeGameState'
import * as Storage from '../lib/storage'

import DecorativeMap from './DecorativeMap'
import CustomiseWorldControl from './menu/CustomiseWorldControl'
import SavedGameList from './menu/SavedGameList'
import NewGameOptions from './menu/NewGameOptions'


const savedGameFolder = "TILE_SAVES"

export default class MainMenu extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            saveFileNames: [],
            saveAsInputValue: "",
            customiseWorldControlIsOpen: false,
        }

        this.saveGame = this.saveGame.bind(this)
        this.saveAs = this.saveAs.bind(this)
        this.loadGame = this.loadGame.bind(this)
        this.deleteGame = this.deleteGame.bind(this)
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

    newGame(makeStateFunction = makeGameStateFunction.randomWorld()) {
        const { storageAction } = this.props
        storageAction("NEW_GAME", { makeStateFunction })
    }

    render() {
        const { setOpenFunction, noActiveGame, browserSupportsLocalStorage } = this.props
        const { saveFileNames, customiseWorldControlIsOpen } = this.state

        const asideStyle = noActiveGame || customiseWorldControlIsOpen
            ? styles.background
            : dialogueStyles.dialogueHolder
        const navStyle = noActiveGame || customiseWorldControlIsOpen
            ? styles.frame
            : dialogueStyles.dialogueFrame

        return <>
            <aside className={asideStyle}>
                {(noActiveGame || customiseWorldControlIsOpen) && <DecorativeMap scale={1} />}
                <nav className={navStyle}>

                    {(noActiveGame || customiseWorldControlIsOpen) ? (
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


                    {customiseWorldControlIsOpen
                        ? <CustomiseWorldControl newGame={this.newGame}>
                            <button className={dialogueStyles.button} onClick={() => {
                                this.setState({ customiseWorldControlIsOpen: false })
                            }}>cancel</button>
                        </CustomiseWorldControl>
                        : <>
                            <NewGameOptions newGame={this.newGame}>
                                <button className={dialogueStyles.button} onClick={() => {
                                    this.setState({ customiseWorldControlIsOpen: true })
                                }}>customise world</button>
                            </NewGameOptions>

                            {browserSupportsLocalStorage
                                ? (<>
                                    {(noActiveGame || customiseWorldControlIsOpen) ? null : (
                                        <section>
                                            <h3>New Saved Game:</h3>
                                            <div className={dialogueStyles.buttonRow}>
                                                <button className={dialogueStyles.button} onClick={this.saveAs}>save as</button>
                                                <input type="text"
                                                    value={this.state.saveAsInputValue}
                                                    onChange={this.handleTextChange} />
                                            </div>
                                        </section>
                                    )}

                                    <SavedGameList
                                        saveFileNames={saveFileNames}
                                        noActiveGame={noActiveGame}
                                        loadGame={this.loadGame}
                                        saveGame={this.saveGame}
                                        deleteGame={this.deleteGame}
                                    />

                                </>) : (
                                    <p>Browser does not support local storage</p>
                                )
                            }
                        </>
                    }


                    <Link href="/"><a>Back to home page</a></Link>

                </nav>
            </aside>
        </>
    }
}