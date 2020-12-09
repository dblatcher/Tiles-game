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
    isPathfinder: boolean;
    isTrader: boolean; //TODO implement rule
    hasDefenseBonusVsMounted: boolean;
    isMounted: boolean;
    isEffectiveAgainstTowns: boolean;
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
        this.isPathfinder = !!config.isPathfinder || false;
        this.isTrader = !!config.isTrader || false;
        this.hasDefenseBonusVsMounted = !!config.hasDefenseBonusVsMounted || false;
        this.isMounted = !!config.isMounted || false;
        this.isEffectiveAgainstTowns = !!config.isEffectiveAgainstTowns || false;

        this.productionCost = config.productionCost || 10;
        this.prerequisite = config.prerequisite || null
    }
    get classIs() { return 'UnitType' }
    get isNaval() { return false }
    get role() {
        if (this.townBuilding) { return "SETTLER" }
        if (this.irrigating || this.mining || this.treeCutting) { return "WORKER" }
        if (this.isTrader) { return "TRADER" }
        if (this.defend >= this.attack && (this.moves > 6 || this.isPathfinder)) { return "SCOUT" }
        if (this.defend >= this.attack && this.moves <= 6) { return "DEFENDER" }
        if (this.defend < this.attack && this.moves <= 6) { return "ATTACKER" }
        if (this.attack && this.moves > 6) { return "CAVALRY" }
        return "SCOUT"
    }

    get infoPageUrl() {
        return `/info/unit/${this.name.toLowerCase()}`
    }

    get spriteStyle() {
        return spriteSheets[this.spriteSheetName].getStyleForFrameCalled(this.spriteFrameName)
    }

    canEnterMapSquare(mapSquare, townInMapSquare=null, unitsInMapSquare=[], unit) {
        const enemyPresence = (
            townInMapSquare && unit.faction !== townInMapSquare.faction || 
            unitsInMapSquare.some(otherUnit => unit.faction !== otherUnit.faction)
        );

        // allows land units to attack sea units from the shore
        if (enemyPresence) {
            return this.attack > 0
        }

        //check for friendly transports
        if (unitsInMapSquare.some(otherUnit => otherUnit.faction === unit.faction && otherUnit.type.passengerCapacity)) {
            return true
        }

        return !mapSquare.terrain.isWater
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

class NavalUnitType extends UnitType {
    passengerCapacity: number;
    constructor(name: string, config: any = {}) {
        super(name, config);

        this.passengerCapacity = config.passengerCapacity || 0
    }

    get isNaval() { return true }

    canEnterMapSquare(mapSquare, townInMapSquare, unitsInMapSquare=[], unit) {
        const enemyUnitPresence = (
            unitsInMapSquare.some(otherUnit => unit.faction !== otherUnit.faction)
        );

        // allows sea units to attack land units from the sea
        // but not occupy towns
        if (enemyUnitPresence) {
            return this.attack > 0
        }

        if (townInMapSquare && townInMapSquare.faction === unit.faction) {
            return true
        }
        return mapSquare.terrain.isWater
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
        productionCost: 30,
        prerequisite: 'ironWorking',
    }),
    spearman: new UnitType('spearman', {
        defend: 2, attack: 1,
        productionCost: 15,
        prerequisite: 'bronzeWorking',
    }),
    warrior: new UnitType('warrior', {
        defend: 1, attack: 1,
        productionCost: 10,
    }),
    horseman: new UnitType('horseman', {
        defend: 1, attack: 2, moves: 12,
        productionCost: 20,
        prerequisite: 'horsebackRiding',
        isMounted: true,
    }),
    knight: new UnitType('knight', {
        defend: 2, attack: 4, moves: 12,
        productionCost: 40,
        prerequisite: 'chivalry',
        isMounted: true,
    }),
    archer: new UnitType('archer', {
        defend: 2, attack: 3,
        productionCost: 30,
        prerequisite: 'warriorCode',
    }),
    explorer: new UnitType('explorer', {
        defend: 1, attack: 0,
        isPathfinder: true,
        productionCost: 20,
        spriteSheetName: 'units2',
        prerequisite: 'seafaring',
    }),
    pikeman: new UnitType('pikeman', {
        defend: 2, attack: 1,
        productionCost: 20,
        spriteSheetName: 'units2',
        prerequisite: 'feudalism',
        hasDefenseBonusVsMounted: true,
    }),
    catapult: new UnitType('catapult', {
        defend: 1, attack: 6,
        productionCost: 40,
        spriteSheetName: 'units2',
        prerequisite: 'mathematics',
    }),
    chariot: new UnitType('chariot', {
        defend: 1, attack: 3,
        productionCost: 30,
        spriteSheetName: 'units2',
        prerequisite: 'theWheel',
        isMounted: true,
    }),
    cannon: new UnitType('cannon', {
        defend: 1, attack: 8,
        productionCost: 50,
        spriteSheetName: 'units2',
        prerequisite: 'metallurgy',
        isEffectiveAgainstTowns: true,
    }),
    elephant: new UnitType('elephant', {
        defend: 1, attack: 2, moves: 12,
        productionCost: 40,
        spriteSheetName: 'units2',
        prerequisite: 'polytheism',
        isMounted: true,
    }),
    crusader: new UnitType('crusader', {
        defend: 1, attack: 5, moves: 12,
        productionCost: 40,
        spriteSheetName: 'units2',
        prerequisite: 'monotheism',
        isMounted: true,
    }),
    dragoon: new UnitType('dragoon', {
        defend: 2, attack: 5, moves: 12,
        productionCost: 60,
        spriteSheetName: 'units2',
        prerequisite: 'leadership',
        isMounted: true,
    }),
    musketeer: new UnitType('musketeer', {
        defend: 4, attack: 2,
        productionCost: 30,
        spriteSheetName: 'units2',
        prerequisite: 'gunpowder',
    }),
    caravan: new UnitType('caravan', {
        defend: 0, attack: 0,
        productionCost: 50,
        isTrader: true,
        spriteSheetName: 'units2',
        prerequisite: 'trade',
    }),
    trireme: new NavalUnitType('trireme', {
        defend: 1, attack: 2,
        moves: 18,
        productionCost: 30,
        spriteSheetName: 'units2',
        prerequisite: 'mapMaking',
        getsLostAtSea: true, // TO DO
        passengerCapacity: 1, 
    }),
    caravel: new NavalUnitType('caravel', {
        defend: 2, attack: 2,
        moves: 24,
        productionCost: 30,
        spriteSheetName: 'units2',
        prerequisite: 'navigation',
        passengerCapacity: 2, 
    }),
    frigate: new NavalUnitType('frigate', {
        defend: 4, attack: 4,
        moves: 24,
        productionCost: 40,
        spriteSheetName: 'units2',
        prerequisite: 'magnetism',
    }),
    galleon: new NavalUnitType('galleon', {
        defend: 3, attack: 2,
        moves: 24,
        productionCost: 40,
        spriteSheetName: 'units2',
        prerequisite: 'magnetism',
        passengerCapacity: 4, 
    }),
}

export { UnitType, unitTypes }