import { OnGoingOrder } from "./OngoingOrder.tsx";
import { Faction } from "./Faction";
import { TechDiscovery, techDiscoveries } from './TechDiscovery.tsx'
import { spriteSheets } from '../SpriteSheet.tsx'

class UnitType {
    name: string;
    displayName: string;
    spriteFrameName: string;
    spriteSheetName: string;
    moves: number;
    roadBuilding: number;
    treeCutting: number;
    townBuilding: number;
    mining: number;
    irrigating: number;
    attack: number;
    defend: number;
    productionCost: number;
    prerequisite: string | null;
    constructor(name: string, config: any = {}) {
        this.name = name;
        this.displayName = config.displayName || name;
        this.spriteFrameName = config.spriteFrameName || name;
        this.spriteSheetName = config.spriteSheetName || 'units';
        this.moves = config.moves || 6;
        this.roadBuilding = config.roadBuilding || 0;
        this.treeCutting = config.treeCutting || 0;
        this.townBuilding = config.townBuilding || 0;
        this.mining = config.mining || 0;
        this.irrigating = config.irrigating || 0;
        this.attack = config.attack || 0;
        this.defend = config.defend || 0;
        this.productionCost = config.productionCost || 10;
        this.prerequisite = config.prerequisite || null
    }
    get classIs() { return 'UnitType' }

    get infoPageUrl() {
        return `/info/unit/${this.name.toLowerCase()}`
    }

    get spriteStyle() {
        return spriteSheets[this.spriteSheetName].getStyleForFrameCalled(this.spriteFrameName)
    }

    checkCanBuildWith(knowTech: Array<TechDiscovery>) {
        if (!this.prerequisite) { return true }
        if (!techDiscoveries[this.prerequisite]) {
            console.warn(`Tech prerequisite[${this.prerequisite}] for BuildingType ${this.name} does not exist.`)
            return true
        }
        return knowTech.includes(techDiscoveries[this.prerequisite])
    }

}

const unitTypes = {
    worker: new UnitType('worker', {
        roadBuilding: 1,
        treeCutting: 1,
        irrigating: 1,
        mining: 1,
        productionCost: 20,
    }),
    settler: new UnitType('settler', {
        roadBuilding: 1, treeCutting: 1, townBuilding: 1,
        productionCost: 50,
    }),
    swordsman: new UnitType('swordsman', {
        defend: 2, attack: 4,
        productionCost: 25,
        prerequisite: 'ironWorking',
    }),
    spearman: new UnitType('spearman', {
        defend: 3, attack: 1,
        productionCost: 15,
        prerequisite: 'bronzeWorking',
    }),
    warrior: new UnitType('warrior', {
        defend: 1, attack: 1,
        productionCost: 10,
    }),
    horseman: new UnitType('horseman', {
        defend: 1, attack: 3, moves: 12,
        productionCost: 25,
        prerequisite: 'horsebackRiding',
    }),
    knight: new UnitType('knight', {
        defend: 2, attack: 6, moves: 12,
        productionCost: 50,
        prerequisite: 'chivalry',
    }),
    archer: new UnitType('archer', {
        defend: 2, attack: 6, moves: 12,
        productionCost: 50,
        prerequisite: 'warriorCode',
    }),
}



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

    get infoPageUrl() { return this.type.infoPageUrl }

    get description() {
        return `${this.vetran ? ' vetran' : ''} ${this.type.displayName}`
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
                vetran: data.veteran,
                remainingMoves: data.remainingMoves,
                indexNumber: data.indexNumber,
                ongoingOrder: deserialisedOrder,
            }
        )
    }
}

export { UnitType, unitTypes, Unit }