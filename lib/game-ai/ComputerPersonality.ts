import { UnitMission } from './UnitMission.ts';
import { Faction } from '../game-entities/Faction.tsx';
import { techDiscoveries } from '../game-entities/TechDiscovery.tsx';
import { onGoingOrderTypes, orderTypesMap } from '../game-entities/OngoingOrder.tsx'
import attemptMove from '../game-logic/attemptMove'

import gameActions from '../game-logic/gameActions'
import { areSamePlace } from '../utility';


class ComputerPersonality {
    faction: Faction;
    config: any;
    constructor(faction: Faction, config: any) {
        this.faction = faction
        this.config = config
    }

    manageTowns(state) {
        const myTowns = state.towns.filter(town => town.faction === this.faction)
        console.log(`* ${this.faction.name} AI is managing its ${myTowns.length} towns`)

        myTowns.forEach(town => {
            town.autoAssignFreeCitizens(state);
        })
    }

    pickNewTech(state) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech))

        //TO DO - logic for computer picking a tech based on computerPersonality goals
        const choosenTechDiscovery = possibleChoices[0]

        console.log(`** ${this.faction.name} AI is now researching ${choosenTechDiscovery.name}`)
        gameActions.CHOOSE_RESEARCH_GOAL({ activeFaction: this.faction, techDiscovery: choosenTechDiscovery })(state)
    }

    getKnownEnemyTowns(state) {
        return state.towns
            .filter(town => town.faction !== this.faction)
            .filter(town => this.faction.worldMap
                .flat()
                .some(mapSquare => mapSquare.x === town.mapSquare.x && mapSquare.y === town.mapSquare.y))
    }

    getKnownEnemyUnits(state) {
        return state.units
            .filter(unit => unit.faction !== this.faction)
            .filter(unit => this.faction.worldMap[unit.y] && this.faction.worldMap[unit.y][unit.x])
    }

    getKnownEnemyUnitInOpen(state) {
        let enemyTowns = this.getKnownEnemyTowns(state)
        let enemyUnits = this.getKnownEnemyUnits(state)

        return enemyUnits
            .filter(unit => !enemyTowns.some(town => areSamePlace(town, unit)))
    }

    assignNewMission(unit, state) {
        // TO DO - logic for picking a mission...


        if (unit.role === "ATTACKER") {
            unit.missions.push(
                new UnitMission('CONQUER', {}),
                new UnitMission('INTERCEPT', { untilCancelled: false })
            )
        }
        if (unit.role === "CAVALRY") {
            unit.missions.push(
                new UnitMission('INTERCEPT', { range: 5, untilCancelled: true }),
                new UnitMission('CONQUER', {}),
            )
        }
        else {
            unit.missions.push(
                new UnitMission('WAIT', {})
            )
        }

        if (unit.missions.length == 0) {
            unit.missions.push(new UnitMission("WAIT"))
        }
    }

    makeMove(state) {
        let moveSuceeded = false;
        const unit = state.selectedUnit;
        if (state.selectedUnit.remainingMoves > 0) {
            console.log(`*${unit.indexNumber}* ${this.faction.name} moving ${unit.description} (${unit.role})`)
            unit.missions = unit.missions.filter(mission => !mission.checkIfFinished(unit, state))
            if (unit.missions.length == 0) { this.assignNewMission(unit, state) }


            // TO DO - allow for missions that return in a START_ORDER call rather than a mapSquare
            let choosenMove = null
            for (let i = 0; i< unit.missions.length; i++) {
                choosenMove = unit.missions[i].chooseMove(unit, state)
                if (choosenMove) {
                    moveSuceeded = attemptMove(state, state.selectedUnit, choosenMove)
                    break;
                }
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

        console.log(`__${movesMade} MOVES MADE__`, result ? 'FINISHED' : '')
        return result
    }

    get serialised() {
        return this.config
    }

}



export { ComputerPersonality }