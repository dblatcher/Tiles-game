import { UnitType, unitTypes } from "./UnitType.ts"
import { OnGoingOrder } from "./OngoingOrder.tsx";
import { Faction } from "./Faction";
import { UnitMission } from '../game-ai/UnitMission.ts'
import { getAreaSurrounding } from '../utility'

let unitIndexNumber = 0

class Unit {
    type: UnitType;
    faction: Faction;
    x: number;
    y: number;
    vetran: boolean;
    remainingMoves: number;
    indexNumber: number;
    onGoingOrder: OnGoingOrder;
    missions: Array<UnitMission>
    constructor(type: UnitType, faction: Faction, config: any = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
        this.vetran = !!config.vetran || false

        this.remainingMoves = typeof config.remainingMoves === 'number'
            ? config.remainingMoves
            : type.moves;
        this.indexNumber = typeof config.indexNumber === 'number'
            ? config.indexNumber
            : unitIndexNumber++
        this.onGoingOrder = config.ongoingOrder || null
        this.missions = config.missions || []
    }

    get infoList() {
        return [
            this.description,
            `Att:${this.type.attack} Def:${this.type.defend}`,
            this.onGoingOrder
                ? `${this.onGoingOrder.type.name}, ${this.onGoingOrder.timeRemaining} turns left`
                : `${this.remainingMoves}/${this.type.moves} movement`,
        ]
    }

    get role() { return this.type.role }

    get infoPageUrl() { return this.type.infoPageUrl }

    get description() {
        return `${this.vetran ? ' vetran' : ''} ${this.type.displayName}`
    }

    isAdjacentTo(target) {
        return !(Math.abs(this.x - target.x) > 1 || Math.abs(this.y - target.y) > 1)
    }

    getMovementCost(startingMapSquare, targetMapSquare) {
        return (startingMapSquare.road && targetMapSquare.road) || this.type.isPathfinder
            ? 1
            : targetMapSquare.movementCost
    }

    getCouldEnter(mapSquare, townInMapSquare) {
        return this.type.canEnterMapSquare(mapSquare, townInMapSquare, this)
    }

    canMoveTo(targetMapSquare, startingMapSquare = null, townInTargetMapSquare = null) {

        if (!this.getCouldEnter(targetMapSquare, townInTargetMapSquare)) { return false }
        const movementCost = this.getMovementCost(startingMapSquare, targetMapSquare)

        return this.isAdjacentTo(targetMapSquare)
            && !(targetMapSquare.x === this.x && targetMapSquare.y === this.y)
            && (this.remainingMoves >= movementCost || this.remainingMoves === this.type.moves)
    }

    canMakeNoMoreMoves(mapGrid, towns, units) {
        const { x, y } = this
        let surroundingArea = getAreaSurrounding(this, mapGrid);

        return !surroundingArea.some(mapSquare => {
            if (units.some(unit => unit.x === mapSquare.x && unit.y === mapSquare.y && unit.faction !== this.faction)) { return true }
            return this.canMoveTo(mapSquare, mapGrid[y][x], towns.filter(town => town.mapSquare === mapSquare)[0])
        })
    }

    processTurn(state) {
        this.remainingMoves = this.type.moves
        const { onGoingOrder } = this

        if (onGoingOrder) {
            onGoingOrder.reduceTime(this)
        }

        if (onGoingOrder && onGoingOrder.timeRemaining <= 0) {
            let squareUnitIsOn = state.mapGrid[this.y][this.x]

            if (onGoingOrder.type.applyEffectOnSquare) {
                onGoingOrder.type.applyEffectOnSquare(squareUnitIsOn)
            }

            this.onGoingOrder = null

            // needs to happen after clearing this.onGoingOrder
            // can add a new order!
            if (onGoingOrder.type.applyEffectOnUnit) {
                onGoingOrder.type.applyEffectOnUnit(this, state)
            }

        }
    }

    get serialised() {
        let output = {
            type: this.type.name,
            faction: this.faction.name,
            onGoingOrder: this.onGoingOrder ? this.onGoingOrder.serialised : null,
            missions: this.missions.map(unitMission => unitMission.serialised)
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })

        return output
    }

    static deserialise(data, factions) {
        let deserialisedOrder = data.onGoingOrder
            ? OnGoingOrder.deserialise(data.onGoingOrder)
            : undefined;

        let deserialisedMissions = data.missions.map(
            unitMission => UnitMission.deserialise(unitMission)
        )


        return new Unit(
            unitTypes[data.type],
            factions.filter(faction => faction.name === data.faction)[0],
            {
                x: data.x,
                y: data.y,
                vetran: data.veteran,
                remainingMoves: data.remainingMoves,
                indexNumber: data.indexNumber,
                ongoingOrder: deserialisedOrder,
                missions: deserialisedMissions,
            }
        )
    }

    static setIndexNumber(value: number = 0) {
        unitIndexNumber = value
    }
}

export { Unit }