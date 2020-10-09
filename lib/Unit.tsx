class UnitType {
    name: string;
    spriteFrameName: string;
    constructor(name: string, config = {}) {
        this.name = name;
        this.spriteFrameName = config.spriteFrameName || name
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

const factions = [
    new Faction('Crimsonia', { color: 'crimson' }),
    new Faction('Azula', { color: 'blue' }),
]

class Unit {
    type: UnitType;
    faction: Faction;
    x: number;
    y: number;
    constructor(type: UnitType, faction: Faction, config = {}) {
        this.type = type
        this.faction = faction
        this.x = config.x;
        this.y = config.y;
    }
}

export { UnitType, unitTypes, Unit, factions }