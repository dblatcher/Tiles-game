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

    attemptMoveTo(mapSquare) {
        if (this.remainingMoves < 1) {
            console.log('NO MOVES LEFT')
            return
        }

        if (Math.abs(this.x - mapSquare.x) > 1 || Math.abs(this.y - mapSquare.y) > 1) {
            console.log('TOO FAR')
            return
        }

        this.remainingMoves = this.remainingMoves - 1
        this.x = mapSquare.x
        this.y = mapSquare.y
    }

    refresh() {
        this.remainingMoves = this.type.moves
    }
}

export { UnitType, unitTypes, Unit, Faction }