import { UnitMission } from './UnitMission.ts';
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
            town.autoAssignFreeCitizens(state);
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

    assignNewMission(unit, state) {
        // TO DO - logic for picking a mission...
        let randomNumber = Math.random()

        let mission = randomNumber > .7
            ? new UnitMission('random', { xTarget: 3, yTarget: 7 })
            : new UnitMission('goTo', { xTarget: 6, yTarget: 4 })

        //console.log(`***Assigning mission to ${unit.description}:`, mission)

        unit.missions.push(
            new UnitMission('goTo', { xTarget: 6, yTarget: 4 }), 
            new UnitMission('goTo', { xTarget: 6, yTarget: 12 })
        )
    }

    makeMove(state) {
        let moveSuceeded = false;
        const unit = state.selectedUnit;
        console.log(`** ${this.faction.name} AI is making a move with ${unit.description} [unit#${unit.indexNumber}] `)
        if (state.selectedUnit.remainingMoves > 0) {

            unit.missions = unit.missions.filter(mission => !mission.checkIfFinished(unit, state))
            if (unit.missions.length == 0) { this.assignNewMission(unit, state) }

            // TO DO - allow for missions that return in a START_ORDER call rather than a mapSquare
            const choosenMove = unit.missions[0].chooseMove(unit, state)
            if (choosenMove) {
                moveSuceeded = attemptMove(state, state.selectedUnit, choosenMove)
            }

            if (!moveSuceeded) { // unit will hold if mission returns null or a mapSquare (move) that fails
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

    get serialised() {
        return this.config
    }

}



export { ComputerPersonality }