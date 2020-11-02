import { OnGoingOrder } from "./OngoingOrder.tsx";
import { Faction } from "./Faction";

class UnitType {
    name: string;
    spriteFrameName: string;
    moves: number;
    roadBuilding: number;
    treeCutting: number;
    townBuilding: number;
    attack: number;
    defend: number;
    productionCost: number;
    constructor(name: string, config: any = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.moves = config.moves || 6;
        this.roadBuilding = config.roadBuilding || 0;
        this.treeCutting = config.treeCutting || 0;
        this.townBuilding = config.townBuilding || 0;
        this.attack = config.attack || 0;
        this.defend = config.defend || 0;
        this.productionCost = config.productionCost || 10;
    }

}

const unitTypes = {
    worker:     new UnitType('worker',   { roadBuilding: 1, treeCutting: 1, productionCost: 20 }),
    settler:    new UnitType('settler',  { roadBuilding: 1, treeCutting: 1, townBuilding: 1, productionCost: 50 }),
    swordsman:  new UnitType('swordsman',{ defend: 2, attack: 4, productionCost: 25 }),
    spearman:   new UnitType('spearman', { defend: 3, attack: 1, productionCost: 15 }),
    warrior:    new UnitType('warrior',  { defend: 1, attack: 1, productionCost: 10 }),
    horseman:   new UnitType('horseman', { defend: 1, attack: 3, moves:12, productionCost: 25 }),
    knight  :   new UnitType('knight',   { defend: 2, attack: 6, moves:12, productionCost: 50 }),
}



let unitIndexNumber = 0

class Unit {
    type: UnitType;
    faction: Faction;
    x: number;
    y: number;
    remainingMoves: number;
    indexNumber: number;
    onGoingOrder: OnGoingOrder;
    constructor(type: UnitType, faction: Faction, config: any = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
        this.remainingMoves = typeof config.remainingMoves === 'number'
            ? config.remainingMoves
            : type.moves;
        this.indexNumber = typeof config.indexNumber === 'number'
            ? config.indexNumber
            : unitIndexNumber++
        this.onGoingOrder = typeof config.onGoingOrder !== 'undefined'
            ? config.onGoingOrder
            : null;
    }

    get infoList() {

        return [
            `${this.faction.name} ${this.type.name}`,
            `Att:${this.type.attack} Def:${this.type.defend}`,
            this.onGoingOrder
                ? `${this.onGoingOrder.type.name}, ${this.onGoingOrder.timeRemaining} turns left`
                : `${this.remainingMoves}/${this.type.moves} movement`,
        ]
    }

    isAdjacentTo(target) {
        return !(Math.abs(this.x - target.x) > 1 || Math.abs(this.y - target.y) > 1)
    }

    canMoveTo(targetMapSquare, startingMapSquare = null) {

        if (targetMapSquare.isWater) { return false }

        const movementCost = startingMapSquare && startingMapSquare.road && targetMapSquare.road
            ? 1
            : targetMapSquare.movementCost

        return this.isAdjacentTo(targetMapSquare)
            && !(targetMapSquare.x === this.x && targetMapSquare.y === this.y)
            && (this.remainingMoves >= movementCost || this.remainingMoves === this.type.moves)
    }

    get serialised() {
        let output = {
            type: this.type.name,
            faction: this.faction.name,
            onGoingOrder: this.onGoingOrder ? this.onGoingOrder.serialised : null
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

        return new Unit(
            unitTypes[data.type],
            factions.filter(faction => faction.name === data.faction)[0],
            {
                x: data.x,
                y: data.y,
                remainingMoves: data.remainingMoves,
                indexNumber: data.indexNumber,
                ongoingOrder: deserialisedOrder,
            }
        )
    }
}

export { UnitType, unitTypes, Unit }