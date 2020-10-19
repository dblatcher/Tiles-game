import { OnGoingOrder } from "./OngoingOrder";
import { Faction } from "./Faction";

class UnitType {
    name: string;
    spriteFrameName: string;
    moves: number;
    roadBuilding: number;
    treeCutting: number;
    attack: number;
    defend: number;
    constructor(name: string, config = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.moves = config.moves || 6;
        this.roadBuilding = config.roadBuilding || 0;
        this.treeCutting = config.treeCutting || 0;
        this.attack = config.attack || 0;
        this.defend = config.defend || 1;
    }

}

const unitTypes = {
    knight: new UnitType('knight', { moves: 8, attack: 4 }),
    worker: new UnitType('worker', { roadBuilding: 1, treeCutting: 1, }),
    spearman: new UnitType('spearman', { defend: 3, attack: 1 }),
}



let unitIndexNumber = 0

class Unit {
    type: UnitType;
    faction: Faction;
    x: number;
    y: number;
    remainingMoves: number;
    onGoingOrder: OnGoingOrder;
    indexNumber: number;
    constructor(type: UnitType, faction: Faction, config = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
        this.remainingMoves = type.moves;
        this.onGoingOrder = null;
        this.indexNumber = unitIndexNumber++
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
}

export { UnitType, unitTypes, Unit }