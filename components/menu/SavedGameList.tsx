import React from 'react'
import dialogueStyles from '../dialogue.module.scss'


export default class SavedGameList extends React.Component {

    props: {
        saveFileNames: string[],
        noActiveGame: boolean,
        loadGame: Function,
        saveGame: Function,
        deleteGame: Function,
    }

    render() {
        const { saveFileNames, noActiveGame, loadGame, saveGame, deleteGame} = this.props

        return (
            <section>
                <h3>Saved Games:</h3>
                {saveFileNames.map(fileName => (
                    <div className={dialogueStyles.buttonRow} key={`file-buttons-${fileName}`}>
                        <span className={dialogueStyles.buttonRowLabel}>{fileName}</span>
                        <button className={dialogueStyles.button}
                            onClick={() => { loadGame(fileName) }}>load</button>
                        {noActiveGame
                            ? null
                            : (<button className={dialogueStyles.button}
                                onClick={() => { saveGame(fileName) }}>save</button>
                            )}
                        <button className={dialogueStyles.button}
                            onClick={() => { deleteGame(fileName) }}>delete</button>
                    </div>
                ))}
            </section>
        )
    }

}