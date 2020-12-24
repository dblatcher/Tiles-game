import { UnitType, unitTypes } from "./UnitType"
import { OnGoingOrder } from "./OngoingOrder";
import { Faction } from "./Faction";
import { UnitMission } from '../game-ai/UnitMission'
import { getAreaSurrounding, areSamePlace, displayTurnsToComplete } from '../utility'
import { MapSquare } from './MapSquare'

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
    passengers: Array<Unit>;
    missions: Array<UnitMission>
    isPassengerOf: Unit | number | null
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
        this.passengers = config.passengers || []
        this.isPassengerOf = config.isPassengerOf || null
        this.missions = config.missions || []
    }

    get infoList() {
        return [
            this.description,
            `Att:${this.type.attack} Def:${this.type.defend}`,
            this.onGoingOrder
                ? isFinite(this.onGoingOrder.timeRemaining)
                    ?`${this.onGoingOrder.type.name}, ${displayTurnsToComplete(this.onGoingOrder.timeRemaining)} left`
                    : this.onGoingOrder.type.name
                : `${this.remainingMoves}/${this.type.moves} movement`,
        ]
    }

    get role() { return this.type.role }

    get infoPageUrl() { return this.type.infoPageUrl }

    get description() {
        return `${this.vetran ? ' vetran' : ''} ${this.type.displayName}`
    }


    isAdjacentTo(target, mapWidth) {
        let xDiff = this.x - target.x
        if (this.x === 0 && target.x === mapWidth - 1) { xDiff = 1 }
        if (target.x === 0 && this.x === mapWidth - 1) { xDiff = 1 }
        return !(Math.abs(xDiff) > 1 || Math.abs(this.y - target.y) > 1)
    }

    getMovementCost(startingMapSquare: MapSquare, targetMapSquare: MapSquare, townInTargetMapSquare = null, unitsInTargetMapSquare: Array<Unit> = []) {
        // attack movement cost = 1
        if (unitsInTargetMapSquare.some(otherUnit => otherUnit.faction !== this.faction)) { return 1 }

        return (startingMapSquare.road && targetMapSquare.road) || this.type.isPathfinder
            ? 1
            : targetMapSquare.movementCost
    }

    getCouldEnter(targetMapSquare: MapSquare, townInTargetMapSquare = null, unitsInTargetMapSquare: Array<Unit> = []) {
        return this.type.canEnterMapSquare(targetMapSquare, townInTargetMapSquare, unitsInTargetMapSquare, this)
    }

    canMoveToOrAttack(targetMapSquare: MapSquare, startingMapSquare: MapSquare = null, townInTargetMapSquare = null, unitsInTargetMapSquare: Array<Unit> = [], mapWidth: number) {

        if (areSamePlace(this, targetMapSquare) || !this.isAdjacentTo(targetMapSquare, mapWidth)) { return false }
        if (!this.getCouldEnter(targetMapSquare, townInTargetMapSquare, unitsInTargetMapSquare)) { return false }

        const movementCost = this.getMovementCost(startingMapSquare, targetMapSquare, townInTargetMapSquare, unitsInTargetMapSquare)
        return this.remainingMoves >= movementCost || this.remainingMoves === this.type.moves
    }

    canMakeNoMoreMoves(mapGrid, towns, units) {
        const { x, y } = this
        let surroundingArea = getAreaSurrounding(this, mapGrid);

        return !surroundingArea.some(mapSquare => {
            return this.canMoveToOrAttack(
                mapSquare,
                mapGrid[y][x],
                towns.filter(town => town.mapSquare === mapSquare)[0],
                units.filter(unit => areSamePlace(mapSquare, unit)),
                mapGrid[0].length
            )
        })
    }

    boardTransport(transport: Unit) {
        if (this.isPassengerOf !== null && typeof this.isPassengerOf !== 'number') { return false }
        this.isPassengerOf = transport
        transport.passengers.push(this)
        return true
    }

    leaveTransport() {
        const transport = this.isPassengerOf
        if (!transport) { return false }
        this.isPassengerOf = null

        if (typeof transport === 'object') {
            transport.passengers.splice(transport.passengers.indexOf(this), 1)
        }
        return true
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
            isPassengerOf: this.isPassengerOf === null
                ? null
                : typeof this.isPassengerOf === 'object'
                    ? this.isPassengerOf.indexNumber
                    : this.isPassengerOf,
            passengers: [], // list is repopulated in  SerialisedGame.deserialise, needs to be set here so not added below 
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
                isPassengerOf: data.isPassengerOf, // needs to be deserialised from number to Unit in deserialiseGame
                missions: deserialisedMissions,
            }
        )
    }

    static setIndexNumber(value: number = 0) {
        unitIndexNumber = value
    }
}

export { Unit }