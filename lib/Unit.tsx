class UnitType {
    name: string;
    spriteFrameName: string;
    moves: number;
    constructor(name: string, config = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.moves = config.moves || 6;
    }

}

const unitTypes = {
    knight: new UnitType('knight', { moves: 8 }),
    worker: new UnitType('worker'),
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
    constructor(type: UnitType, faction: Faction, config = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
        this.remainingMoves = type.moves;
    }

    get infoList() {

        return [
            `${this.faction.name} ${this.type.name}`,
            `${this.remainingMoves}/${this.type.moves} movement`,
            `[${this.x}, ${this.y}]`,
        ]
    }

    refresh() {
        this.remainingMoves = this.type.moves
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