import { areSamePlace, sleep, asyncSetState } from '../lib/utility'
import gameActions from '../lib/game-logic/gameActions.ts'
import { debugLogAtLevel } from '../lib/logging'

export default function letComputerTakeItsTurn() {
    const { activeFaction } = this.state
    const placesInSight = this.primaryPlayerFaction.placesInSightThisTurn

    let computerHasFinished = false
    let unitThatMoved = null
    let unitThatMovedWasInViewBeforeMove = undefined
    let unitThatMovedWasInViewAfterMove = undefined
    let movesMade = 0
    let moveTimeStamp


    const letComputerMakeMove = async () => {

        await asyncSetState(this, state => {
            moveTimeStamp = Date.now()
            unitThatMoved = state.selectedUnit
            unitThatMovedWasInViewBeforeMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
            activeFaction.computerPersonality.makeMove(state)
            movesMade++
            computerHasFinished = activeFaction.computerPersonality.checkIfFinished(state, movesMade)
            return state
        })

        unitThatMovedWasInViewAfterMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
        debugLogAtLevel(2)(`****Move took: ${Date.now() - moveTimeStamp}ms`)

        if (unitThatMovedWasInViewAfterMove || unitThatMovedWasInViewBeforeMove) {
            this.scrollToSquare(unitThatMoved)
            await sleep(250)
        } else {
            await sleep(10)
        }

        if (computerHasFinished) {
            await asyncSetState(this, gameActions.END_OF_TURN()(this.state))
            if (this.isComputerPlayersTurn) {
                this.letComputerTakeItsTurn()
            } else {
                this.scrollToSelection()
            }
        } else {
            letComputerMakeMove()
        }
    }

    debugLogAtLevel(1)(`___${activeFaction.name.toUpperCase()} STARTING TURN____`)
    letComputerMakeMove()

}

