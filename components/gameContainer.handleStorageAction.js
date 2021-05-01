import { SerialisedGame } from '../lib/serialiseGame.ts'
import * as Storage from '../lib/storage'
import { Message } from '../lib/game-entities/Message'
import { Unit } from '../lib/game-entities/Unit'
import { Town } from '../lib/game-entities/Town'

import startOfTurn from '../lib/game-logic/startOfTurn'
import { Village } from '../lib/game-entities/Village'

export default function handleStorageAction(command, input) {

    if (command === 'NEW_GAME') {

        Unit.setIndexNumber();
        Town.setIndexNumber();

        this.setState(
            Object.assign({ mainMenuOpen: false }, input.makeStateFunction()),
            () => {

                this.setStateUpdateTutorialEvents(
                    state => {
                        startOfTurn()(state)
                        state.interfaceMode = 'MOVE'
                        return state
                    },
                    () => {
                        this.scrollToSelection()
                    }
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
            Village.setIndexNumber();
            let deserialisedLoadedState = new SerialisedGame(loadedGameData, true).deserialise()

            Unit.setIndexNumber(Math.max(...deserialisedLoadedState.units.map(unit => unit.indexNumber)) + 1);
            Town.setIndexNumber(Math.max(...deserialisedLoadedState.towns.map(town => town.indexNumber)) + 1);
            Village.setIndexNumber(Math.max(...deserialisedLoadedState.villages.map(village => village.indexNumber)) + 1);

            this.setState(state => {
                state.pendingDialogues.push(new Message(`GAME LOADED: ${input.itemName}`))
                let modification = {
                    pendingDialogues: state.pendingDialogues,
                    mainMenuOpen: false,
                    interfaceMode: "VIEW",
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