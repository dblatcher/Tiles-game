import { SerialisedGame } from '../lib/serialiseGame'
import * as Storage from '../lib/storage'
import { Message } from '../lib/game-entities/Message.tsx'
import { Unit } from '../lib/game-entities/Unit.tsx'
import { Town } from '../lib/game-entities/Town.tsx'

import startOfTurn from '../lib/game-logic/startOfTurn'

export default function handleStorageAction(command, input) {

    if (command === 'NEW_GAME') {

        Unit.setIndexNumber();
        Town.setIndexNumber();

        this.setState(
            Object.assign({ mainMenuOpen: false }, input.makeStateFunction()),
            () => {

                this.setState(
                    state => {
                        startOfTurn()(state)
                        this.state.interfaceMode = 'MOVE'
                        return state
                    },
                    this.scrollToSelection
                )
            }
        )
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
            Unit.setIndexNumber();
            Town.setIndexNumber();
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