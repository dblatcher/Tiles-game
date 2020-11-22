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

        let enemyTowns = this.getKnownEnemyTowns(state)
        let enemyUnitsInOpen = this.getKnownEnemyUnitInOpen(state)


        if (unit.role === "ATTACKER") {
            let targetSquare = enemyTowns[0] ? enemyTowns[0].mapSquare : null

            unit.missions.push(targetSquare
                ? new UnitMission('CONQUER', { xTarget: targetSquare.x, yTarget: targetSquare.y })
                : new UnitMission('INTERCEPT', { untilCancelled: false })
            )
        }
        if (unit.role === "CAVALRY") {
            unit.missions.push(new UnitMission('INTERCEPT', { range: 3, untilCancelled: true }))
        }
        else {
            unit.missions.push(Math.random() > .7
                ? new UnitMission('RANDOM', {})
                : new UnitMission('GO_TO', { xTarget: 6, yTarget: 4 })
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
            console.log(`*${unit.indexNumber}* misson: ${unit.missions[0] ? unit.missions[0].type : 'none'}`, unit.missions[0])


            // TO DO - allow for missions that return in a START_ORDER call rather than a mapSquare
            // TO DO - if mission[0].chooseMove returns null, try the next missions before accepting
            // - eg  Unit has mission to attack enememy[0] but a fallback mission to explore[1] if none in sight

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

        console.log(`__${movesMade} MOVES MADE__`, result ? 'FINISHED' : '')
        return result
    }

    get serialised() {
        return this.config
    }

}



export { ComputerPersonality }