import { areSamePlace, sleep, asyncSetState } from '../lib/utility'
import gameActions from '../lib/game-logic/gameActions'

export default function letComputerTakeItsTurn() {
    const { activeFaction } = this.state
    const { primaryPlayerFaction } = this
    const placesInSight = primaryPlayerFaction.placesInSightThisTurn

    let computerHasFinished = false
    let unitThatMoved = null
    let unitThatMovedWasInViewBeforeMove = undefined
    let unitThatMovedWasInViewAfterMove = undefined
    let movesMade = 0
    let moveTimeStamp


    const letComputerMakeMove = () => {

        this.setState(
            state => {
                moveTimeStamp = Date.now()
                unitThatMoved = state.selectedUnit
                unitThatMovedWasInViewBeforeMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
                activeFaction.computerPersonality.makeMove(state)
                movesMade++
                computerHasFinished = activeFaction.computerPersonality.checkIfFinished(state, movesMade)
                return state
            },
            async () => {
                unitThatMovedWasInViewAfterMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
                console.log(`****Move took: ${Date.now() - moveTimeStamp}ms`)
                if (unitThatMovedWasInViewAfterMove || unitThatMovedWasInViewBeforeMove) {
                    this.scrollToSquare(unitThatMoved)
                    await sleep(250)
                } else {
                    await sleep(10)
                }

                if (computerHasFinished) {
                    this.setState(
                        gameActions.END_OF_TURN()(this.state),
                        () => {
                            if (this.isComputerPlayersTurn) {
                                this.letComputerTakeItsTurn()
                            } else {
                                this.scrollToSelection('letComputerMakeMove, computerHasFinished')
                            }
                        }
                    )
                } else {
                    letComputerMakeMove()
                }
            })
    }

    console.log(`___${activeFaction.name.toUpperCase()} STARTING TURN____`)
    letComputerMakeMove()

}

