import killUnit from './killUnit.ts'
import selectNextOrPreviousUnit from './selectNextOrPreviousUnit'

const resolveBattle = input => state => {
    const {battle} = input
    if (state.pendingDialogues[0] === battle) {state.pendingDialogues.shift()}
    battle.attacker.remainingMoves = 0;
    let outcome = battle.resolve()
    killUnit(state, outcome.loser)
    outcome.winner.vetran = true
    if ([outcome.loser, outcome.winner].includes(state.selectedUnit)) { selectNextOrPreviousUnit(state) }
    return state
}

export default resolveBattle