
import { onGoingOrderTypes } from "../game-entities/OngoingOrder";
import { Unit } from "../game-entities/Unit";
import { areSamePlace, getAreaSurrounding } from "../utility";
import { unitMissionTypes} from "./UnitMissionTypes"
import { GameState } from '../game-entities/GameState'

class UnitMission {
    type: string;
    xTarget: number | null;
    yTarget: number | null;
    range: number | null;
    untilCancelled: boolean;
    constructor(type: string, config: any = {}) {
        this.type = type

        if (config.target) {
            this.target = config.target
        } else {
            this.xTarget = config.xTarget || null
            this.yTarget = config.yTarget || null
        }

        this.range = config.range || null
        this.untilCancelled = !!config.untilCancelled
    }

    checkIfFinished(unit:Unit, state:GameState) {
        return unitMissionTypes[this.type].checkIfFinished.apply(this, [unit, state])
    }

    chooseMove(unit:Unit, state:GameState) {
        let possibleMoves = getAreaSurrounding(unit,state.mapGrid)
            .filter(mapSquare => {
                if (mapSquare === null) {return false}
                const townInMapSquare = state.towns.filter(town => town.x == mapSquare.x && town.y === mapSquare.y)[0]
                const unitsInMapSquare = state.units.filter(otherUnit => areSamePlace(otherUnit, mapSquare))
                return unit.canMoveToOrAttack(mapSquare, state.mapGrid[unit.y][unit.x], townInMapSquare, unitsInMapSquare, state.mapGrid[0].length)
            })

        let possibleActions = unit.onGoingOrder
            ? []
            : onGoingOrderTypes
                .filter(orderType => orderType.canUnitUse(unit))
                .filter(orderType => orderType.checkIsValidForSquare(state.mapGrid[unit.y][unit.x]))

        const ai = unit.faction.computerPersonality
        return unitMissionTypes[this.type].chooseMove.apply(this, [ai, unit, state, possibleMoves, possibleActions])
    }

    set target(newTarget: any) {

        if (newTarget === null) {
            this.xTarget = null
            this.yTarget = null
        } else if (typeof newTarget !== 'object') {
            console.warn('invalid Mission target', newTarget)
        } else {

            if (newTarget.mapSquare) { newTarget = newTarget.mapSquare }

            if (typeof newTarget.x != 'number' || typeof newTarget.y != 'number') {
                console.warn('invalid Mission target', newTarget)
            } else {
                this.xTarget = newTarget.x
                this.yTarget = newTarget.y
            }
        }
    }

    get target() {
        if (typeof this.xTarget == 'number' && typeof this.yTarget == 'number') {
            return { x: this.xTarget, y: this.yTarget }
        }
        return null
    }

    get serialised() {
        let output = {}
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data) {
        return new UnitMission(data.type, {
            xTarget: data.xTarget,
            yTarget: data.yTarget,
        })
    }
}


export { UnitMission } 