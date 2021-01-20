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
    testToStart: (state: GameState) => boolean
    testToFinish: (state: GameState) => boolean
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
    playerFaction: Faction
    constructor(enabled:boolean, playerFaction:Faction) {
        this.enabled = enabled
        this.playerFaction = playerFaction
        this.showing = true

        this.events = [
            new TutorialEvent('firstMove',
                (state: GameState) => true,
                (state: GameState) => state.units.some(unit => unit.faction === this.playerFaction && (unit.remainingMoves < unit.type.moves)),
            ),
            new TutorialEvent('nextMove',
                (state: GameState) => state.units.some(unit => unit.faction === this.playerFaction && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
                (state: GameState) => true,
                ['firstMove']
            ),
            new TutorialEvent('townWindow',
                (state: GameState) => !!state.openTown,
                (state: GameState) => !state.openTown,
            ),
            new TutorialEvent('factionWindow',
                (state: GameState) => !!state.factionWindowIsOpen,
                (state: GameState) => !state.factionWindowIsOpen,
            ),
            new TutorialEvent('endOfTurn',
                (state: GameState) => !state.units.some(unit => unit.faction === this.playerFaction && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
                (state: GameState) => state.units.some(unit => unit.faction === this.playerFaction && !unit.canMakeNoMoreMoves(state.mapGrid, state.towns, state.units)),
            ),
        ]
    }

    get message() {
        const activeEvents = this.events.filter(event => event.hasStarted && !event.hasFinished)
        if (!activeEvents[0]) { return null }
        return tutuorialContent[activeEvents[0].eventKeyName] || null
    }

    updateEvents(state: GameState) {

        const prerequisteEventNotFinished = (eventKeyName) => {
            const event = this.events.filter(event => event.eventKeyName === eventKeyName)[0]
            if (!event) {return false}
            return !event.hasFinished
        }

        if (!this.enabled) { return }
        this.events.forEach(event => {

            if (event.hasFinished) { return }

            if (!event.hasStarted) {
                event.hasStarted = !event.prerequisteEvents.some(prerequisteEventNotFinished) && event.testToStart(state)
                if (event.hasStarted) {
                    this.showing = true
                    return
                }
            }

            if (event.hasStarted) {
                event.hasFinished = event.testToFinish(state)
            }
        })
    }
}


export { TutorialState }