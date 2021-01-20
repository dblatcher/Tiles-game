import { Faction } from "../game-entities/Faction"
import { GameState } from "../game-entities/GameState"

const tutuorialContent = {

    firstMove: {
        text: {
            english: "Welcome to conquest. To move your units, click on one of the tiles next to them. Give it a try!"
        }
    },
    nextMove: {
        text: {
            english: "When a unit has used all its moves for a turn, the next unit will become active. You can also choose which unit to move next by using the arrow button in the most right of the screen, or clicking the mode button to change from 'move units' to 'examine map', then clicking the unit you want to select."
        }
    },
    townWindow: {
        text: {
            english: "This is the Town window. You can change what the town is building and assign workers to squares."
        }
    },
    factionWindow: {
        text: {
            english: "This is the Faction window. You can set the budget for your faction, see an overview of your towns and check your research progress."
        }
    },
    endOfTurn: {
        text: {
            english: "When you have finished moving your units, press the 'end turn' button."
        }
    }

}

class TutorialEvent {
    eventKeyName: string
    testToStart: (state: GameState, humanPlayer: Faction) => boolean
    testToFinish: (state: GameState, humanPlayer: Faction) => boolean
    hasStarted: boolean
    hasFinished: boolean
    prerequisteEvents: string[]

    constructor(eventKeyName, testToStart, testToFinish, prerequisteEvents = []) {

        this.eventKeyName = eventKeyName
        this.testToFinish = testToFinish
        this.testToStart = testToStart
        this.hasStarted = false
        this.hasFinished = false
        this.prerequisteEvents = prerequisteEvents || []
    }
}


class TutorialState {
    enabled: boolean
    showing: boolean
    events: TutorialEvent[]
    constructor(enabled) {
        this.enabled = enabled
        this.showing = true

        this.events = [
            new TutorialEvent('firstMove',
                (state: GameState, humanPlayer: Faction) => true,
                (state: GameState, humanPlayer: Faction) => state.units.some(unit => unit.faction === humanPlayer && (unit.remainingMoves < unit.type.moves)),
            ),
            new TutorialEvent('nextMove',
                (state: GameState, humanPlayer: Faction) => state.units.some(unit => unit.faction === humanPlayer && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
                (state: GameState, humanPlayer: Faction) => true,
                ['firstMove']
            ),
            new TutorialEvent('townWindow',
                (state: GameState, humanPlayer: Faction) => !!state.openTown,
                (state: GameState, humanPlayer: Faction) => !state.openTown,
            ),
            new TutorialEvent('factionWindow',
                (state: GameState, humanPlayer: Faction) => !!state.factionWindowIsOpen,
                (state: GameState, humanPlayer: Faction) => !state.factionWindowIsOpen,
            ),
            new TutorialEvent('endOfTurn',
                (state: GameState, humanPlayer: Faction) => !state.units.some(unit => unit.faction === humanPlayer && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
                (state: GameState, humanPlayer: Faction) => state.units.some(unit => unit.faction === humanPlayer && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
            ),
        ]
    }

    get message() {
        const activeEvents = this.events.filter(event => event.hasStarted && !event.hasFinished)
        if (!activeEvents[0]) { return null }
        return tutuorialContent[activeEvents[0].eventKeyName] || null
    }

    updateEvents(state: GameState) {
        // TO DO: duplicates logic in GameContainer property - not good
        const humanPlayers = state.factions.filter(faction => !faction.isComputerPlayer)
        const humanPlayer = humanPlayers[0] || null


        const prerequisteEventNotFinished = (eventKeyName) => {
            const event = this.events.filter(event => event.eventKeyName === eventKeyName)[0]
            if (!event) {return false}
            return !event.hasFinished
        }

        if (!this.enabled) { return }
        this.events.forEach(event => {

            if (event.hasFinished) { return }

            if (!event.hasStarted) {
                event.hasStarted = !event.prerequisteEvents.some(prerequisteEventNotFinished) && event.testToStart(state, humanPlayer)
                if (event.hasStarted) {
                    this.showing = true
                    return
                }
            }

            if (event.hasStarted) {
                event.hasFinished = event.testToFinish(state, humanPlayer)
            }
        })
    }
}


export { TutorialState }