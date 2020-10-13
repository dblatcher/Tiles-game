import { OnGoingOrder } from "./OngoingOrder";

class UnitType {
    name: string;
    spriteFrameName: string;
    moves: number;
    roadBuilding: number;
    constructor(name: string, config = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.moves = config.moves || 6;
        this.roadBuilding = config.roadBuilding || 0;
        this.treeCutting = config.treeCutting || 0;
    }

}

const unitTypes = {
    knight: new UnitType('knight', { moves: 8 }),
    worker: new UnitType('worker', { roadBuilding: 1, treeCutting:1 }),
    spearman: new UnitType('spearman'),
}

class Faction {
    name: string;
    color: string;
    constructor(name: string, config = {}) {
        this.name = name;
        this.color = config.color || "#FFF";
    }
}


class Unit {
    type: UnitType;
    faction: Faction;
    x: number;
    y: number;
    remainingMoves: number;
    onGoingOrder: OnGoingOrder;
    constructor(type: UnitType, faction: Faction, config = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
        this.remainingMoves = type.moves;
        this.onGoingOrder = null;
    }

    get infoList() {

        return [
            `${this.faction.name} ${this.type.name}`,
            this.onGoingOrder
                ? `${this.onGoingOrder.type.name}, ${this.onGoingOrder.timeRemaining} turns left`
                : `${this.remainingMoves}/${this.type.moves} movement`,
            `[${this.x}, ${this.y}]`,
        ]
    }

    isAdajcentTo(target) {
        return !(Math.abs(this.x - target.x) > 1 || Math.abs(this.y - target.y) > 1)
    }

    canMoveTo(targetMapSquare, startingMapSquare = null) {

        const movementCost = startingMapSquare && startingMapSquare.road && targetMapSquare.road
            ? 1
            : targetMapSquare.movementCost

        return this.isAdajcentTo(targetMapSquare)
            && !(targetMapSquare.x === this.x && targetMapSquare.y === this.y)
            && (this.remainingMoves >= movementCost || this.remainingMoves === this.type.moves)
    }
}

export { UnitType, unitTypes, Unit, Faction }