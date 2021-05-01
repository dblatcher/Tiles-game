import { Citizen } from "./Citizen";
import { Unit } from "./Unit";

class OnGoingOrderType {
    name: string;
    requiredUnitSkill: string | false;
    letterCode: string;
    materialIcon: string | null;
    applyEffectOnSquare: Function | null;
    applyEffectOnUnit: Function | null;
    checkIsValidForSquare: Function;
    timeTaken: number;
    noFlag: boolean;
    cannotCancel: boolean;
    specialCase: boolean;
    onlyOnMenuToCancel: boolean;

    constructor(name, checkIsValidForSquare, config: any = {}) {
        this.name = name
        this.checkIsValidForSquare = checkIsValidForSquare || function () { return true }

        this.applyEffectOnSquare = config.applyEffectOnSquare || null
        this.applyEffectOnUnit = config.applyEffectOnUnit || null
        this.requiredUnitSkill = config.requiredUnitSkill || false
        this.letterCode = config.letterCode || name[0]
        this.materialIcon = config.materialIcon || null
        this.timeTaken = config.timeTaken || 1
        this.noFlag = !!config.noFlag || false
        this.cannotCancel = !!config.cannotCancel || false
        this.specialCase = !!config.specialCase || false
        this.onlyOnMenuToCancel = !!config.onlyOnMenuToCancel || false
    }

    get classIs() { return "OnGoingOrderType" }

    canUnitUse(unit:Unit) {
        if (this.onlyOnMenuToCancel) {
            return unit.onGoingOrder && unit.onGoingOrder.type === this
        }
        if (!this.requiredUnitSkill) { return true }
        return unit.type[this.requiredUnitSkill] > 0
    }
}


const fortifiedOrderType = new OnGoingOrderType('Fortified',
    mapSquare => true,
    {
        letterCode: 'F',
        timeTaken: Infinity,
        onlyOnMenuToCancel: true,
    })

const onGoingOrderTypes = [
    new OnGoingOrderType('Hold Unit',
        mapSquare => true,
        {
            timeTaken: 1,
            letterCode: 'H',
            materialIcon: 'pan_tool',
            noFlag: true,
            cannotCancel: true,
        }),
    new OnGoingOrderType('Build Road',
        mapSquare => !mapSquare.road,
        {
            requiredUnitSkill: 'roadBuilding',
            applyEffectOnSquare: mapSquare => { mapSquare.road = true },
            timeTaken: 3,
            letterCode: 'R',
            materialIcon: 'add_road',
        }),
    new OnGoingOrderType('Cut Down Trees',
        mapSquare => mapSquare.tree,
        {
            requiredUnitSkill: 'treeCutting',
            applyEffectOnSquare: mapSquare => { mapSquare.tree = false },
            timeTaken: 3,
            letterCode: 'C',
            materialIcon: 'carpenter',
        }),
    new OnGoingOrderType('Irrigate',
        mapSquare => mapSquare.terrain.canIrrigate, // TO DO - check for water source?
        {
            requiredUnitSkill: 'irrigating',
            applyEffectOnSquare: mapSquare => {
                mapSquare.mine = false
                mapSquare.irrigation = true
            },
            timeTaken: 3,
            letterCode: 'I',
            materialIcon: 'waves',
        }),
    new OnGoingOrderType('Mine',
        mapSquare => mapSquare.terrain.canMine, // TO DO - check for water source?
        {
            requiredUnitSkill: 'mining',
            applyEffectOnSquare: mapSquare => {
                mapSquare.mine = true
                mapSquare.irrigation = false
            },
            timeTaken: 4,
            letterCode: 'M',
            materialIcon: 'construction',
        }),
    new OnGoingOrderType('Build Town',
        mapSquare => !mapSquare.terrain.isWater && !mapSquare.terrain.neverTown,
        {
            requiredUnitSkill: 'townBuilding',
            materialIcon: 'foundation',
            letterCode: 'B',
            specialCase: true,
        }),
    new OnGoingOrderType('Fortify',
        mapSquare => true,
        {
            letterCode: 'F',
            materialIcon: 'security',
            timeTaken: 1,
            applyEffectOnUnit: (unit, state) => {
                unit.onGoingOrder = new OnGoingOrder(fortifiedOrderType)
                unit.remainingMoves = 0

                //remove enemy citizens working the square
                const mapSquare = state.mapGrid[unit.y][unit.x]

                const enemyCitizensWorkingSquare = state.towns
                    .filter(town => town.faction !== unit.faction)
                    .map(town => town.citizens)
                    .flat()
                    .filter(citizen => citizen.mapSquare === mapSquare)

                enemyCitizensWorkingSquare.forEach(citizen => citizen.changeJob())
            }
        }),
    fortifiedOrderType,
    new OnGoingOrderType('Disband',
        mapSquare => true,
        {
            letterCode: 'D',
            specialCase: true,
            materialIcon: 'clear',
        }),
]

class OnGoingOrder {
    type: OnGoingOrderType;
    timeRemaining: number;
    constructor(type, timeRemaining: number | false = false) {
        this.type = type;
        this.timeRemaining = typeof timeRemaining === 'number' ? timeRemaining : type.timeTaken
    }

    reduceTime(unit) {
        if (!this.type.requiredUnitSkill) {
            this.timeRemaining = this.timeRemaining - 1
        } else {
            this.timeRemaining = this.timeRemaining - unit.type[this.type.requiredUnitSkill]
        }
    }

    get serialised() {
        let output = {
            type: this.type.name,
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data) {

        let deserialiseOrder = new OnGoingOrder(
            onGoingOrderTypes.filter(type => type.name === data.type)[0],
            data.timeRemaining
        )
        return deserialiseOrder
    }
}

let orderTypesMap = {}
onGoingOrderTypes.forEach(type => { orderTypesMap[type.name] = type })

export { onGoingOrderTypes, OnGoingOrder, OnGoingOrderType, orderTypesMap }