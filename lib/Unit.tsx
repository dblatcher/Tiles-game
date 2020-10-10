class UnitType {
    name: string;
    spriteFrameName: string;
    moves: number;
    constructor(name: string, config = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.moves = config.moves || 3;
    }

}

const unitTypes = {
    knight: new UnitType('knight'),
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

    attemptMoveTo(target) {
        if (this.remainingMoves < 1) {
            console.log('NO MOVES LEFT')
            return
        }

        if (!this.isInRangeOf(target)) {
            console.log('TOO FAR')
            return
        }

        this.remainingMoves = this.remainingMoves - 1
        this.x = target.x
        this.y = target.y
    }

    refresh() {
        this.remainingMoves = this.type.moves
    }

    isInRangeOf(target) {
        return !(Math.abs(this.x - target.x) > 1 || Math.abs(this.y - target.y) > 1)
    }
}

export { UnitType, unitTypes, Unit, Faction }