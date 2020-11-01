import { Message } from '../lib/game-entities/Message.tsx'
import { SerialisedGame } from '../lib/serialiseGame'
import * as Storage from '../lib/storage'

export default function handleStorageAction(command, input) {

    if (command === 'NEW_GAME') {
        this.setState(Object.assign({mainMenuOpen: false},input.data))
    }


    if (command === 'SAVE_GAME') {
        let serialisedState = new SerialisedGame(this.state)

        Storage.save(input.savedGameFolder, input.itemName, serialisedState)

        this.setState(state => {
            state.pendingDialogues.push(new Message(`GAME SAVED: ${input.itemName}`))
            return { pendingDialogues: state.pendingDialogues, mainMenuOpen: false, }
        })
    }


    if (command === 'LOAD_GAME') {
        try {
            const loadedGameData = Storage.load(input.savedGameFolder, input.itemName)
            let deserialisedLoadedState = new SerialisedGame(loadedGameData, true).deserialise()

            this.setState(state => {
                state.pendingDialogues.push(new Message(`GAME LOADED: ${input.itemName}`))
                let modification = {
                    pendingDialogues: state.pendingDialogues,
                    mainMenuOpen: false,
                }
                Object.keys(deserialisedLoadedState).forEach(key => {
                    modification[key] = deserialisedLoadedState[key]
                })
                return modification
            })
        }
        catch (error) {
            console.warn(error)
            this.setState(state => {
                state.pendingDialogues.push(new Message(`Failed to load game: ${error.toString()}`))
                return {
                    pendingDialogues: state.pendingDialogues,
                    mainMenuOpen: false,
                }
            })
        }
    }
}