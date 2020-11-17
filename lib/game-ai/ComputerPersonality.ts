import { Faction } from '../game-entities/Faction.tsx';
import { techDiscoveries } from '../game-entities/TechDiscovery.tsx';
import { onGoingOrderTypes, orderTypesMap } from '../game-entities/OngoingOrder.tsx'
import attemptMove from '../game-logic/attemptMove'

import gameActions from '../game-logic/gameActions'

class ComputerPersonality {
    faction: Faction;
    config: any;
    constructor(faction: Faction, config: any) {
        this.faction = faction
        this.config = config
    }

    manageTowns(state) {
        console.log(`** ${this.faction.name} AI is managing its towns`)
        const myTowns = state.towns.filter(town => town.faction === this.faction)

        myTowns.forEach(town => {
            console.log(`*** managaging ${town.name}`)
            //TO DO assign citizens and set production
        })
    }

    pickNewTech(state) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech))

        console.log(`** ${this.faction.name} AI needs to pick new tech.`, { possibleChoices })

        //TO DO - logic for computer picking a tech
        const choosenTechDiscovery = possibleChoices[0]

        console.log(`*** ${this.faction.name} AI is taking ${choosenTechDiscovery.name}`)
        gameActions.CHOOSE_RESEARCH_GOAL({ activeFaction: this.faction, techDiscovery: choosenTechDiscovery })(state)
    }

    makeMove(state) {
        console.log(`** ${this.faction.name} AI is making a move with ${state.selectedUnit.description} [unit#${state.selectedUnit.indexNumber}] `)
        if (state.selectedUnit.remainingMoves > 0) {
            // TO DO - move units!

            const {x,y} = state.selectedUnit;

            const possibleMoves = state.mapGrid
                .slice(y - 1, y + 2)
                .map(row => row.slice(x - 1, x + 2))
                .flat()
                .filter(mapSquare => state.selectedUnit.canMoveTo(mapSquare, state.mapGrid[y][x]))

            if (possibleMoves.length > 0 ) {
                let choiceIndex = Math.floor(Math.random() * possibleMoves.length)
                attemptMove(state, state.selectedUnit,possibleMoves[choiceIndex])

            } else {
                gameActions.START_ORDER({ unit: state.selectedUnit, orderType: orderTypesMap['Hold Unit'] })(state)
            }

        } else {
            gameActions.NEXT_UNIT({})(state)
        }
    }

    checkIfFinished(state, movesMade) {
        let result
        const myUnitsWithMovesLeft = state.units
            .filter(unit => unit.faction === this.faction)
            .filter(unit => unit.remainingMoves > 0)
        result = myUnitsWithMovesLeft.length === 0

        console.log(`** has ${this.faction.name} finished turn after ${movesMade} moves?`, result)
        return result
    }
}



export { ComputerPersonality }