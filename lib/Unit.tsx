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

class Unit {
    type: UnitType;
    x: number;
    y: number;
    constructor(type: UnitType, config = {}) {
        this.type = type

        this.x = config.x;
        this.y = config.y;
    }
}

export { UnitType, unitTypes, Unit }