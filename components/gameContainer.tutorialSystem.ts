import { GameState } from '../lib/game-entities/GameState'
import { TutorialState } from '../lib/game-misc/tutorial'
import GameContainer from './GameContainer'

export default {
    handleTutorialClick(input: "DISMISS" | "SHOW") {
        const component = this as GameContainer

        switch (input) {
            case "DISMISS":
                component.setState((state: GameState) => {
                    const tutorial = state.tutorial as TutorialState
                    tutorial.showing = false
                    return { tutorial }
                })
                break;
            case "SHOW":
                component.setState((state: GameState) => {
                    const tutorial = state.tutorial as TutorialState
                    tutorial.showing = true
                    return { tutorial }
                })
                break;
        }

    },

    setStateUpdateTutorialEvents(setStateInput: Function | object, callback: Function = null) {
        const component = this as GameContainer

        component.setState(setStateInput, () => {
            if (callback) { callback() }
            if (!component.state.tutorial) { return false }

            component.setState((state: GameState) => {
                const tutorial = state.tutorial as TutorialState
                if (tutorial) {
                    tutorial.updateEvents(state)
                }
                return state
            })
        })
    },
}
