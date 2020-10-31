class OnGoingOrderType {
    name: String;
    requiredUnitSkill: String | boolean;
    letterCode: String;
    applyOutcome: Function;
    checkIsValidForSquare: Function;
    timeTaken: number;
    noFlag: boolean;
    cannotCancel: boolean;
    specialCase: boolean;

    constructor(name, applyOutcome, checkIsValidForSquare, config = {}) {
        this.name = name
        this.applyOutcome = applyOutcome
        this.checkIsValidForSquare = checkIsValidForSquare || function () { return true }

        this.requiredUnitSkill = config.requiredUnitSkill || false
        this.letterCode = config.letterCode || name[0]
        this.timeTaken = config.timeTaken || 1
        this.noFlag = !!config.noFlag || false
        this.cannotCancel = !!config.cannotCancel || false
        this.specialCase  = !!config.specialCase || false
    }

    canUnitUse(unit) {
        if (!this.requiredUnitSkill) { return true }
        return unit.type[this.requiredUnitSkill] > 0
    }
}

const onGoingOrderTypes = [
    new OnGoingOrderType('Hold Unit',
        mapSquare => { },
        mapSquare => true,
        {
            timeTaken: 1,
            letterCode: 'H',
            noFlag:true,
            cannotCancel: true,
        }),
    new OnGoingOrderType('Build Road',
        mapSquare => { mapSquare.road = true },
        mapSquare => !mapSquare.road,
        {
            requiredUnitSkill: 'roadBuilding',
            timeTaken: 3,
            letterCode: 'R'
        }),
    new OnGoingOrderType('Cut Down Trees',
        mapSquare => { mapSquare.tree = false },
        mapSquare => mapSquare.tree,
        {
            requiredUnitSkill: 'treeCutting',
            timeTaken: 3,
            letterCode: 'C',
        }),
    new OnGoingOrderType('Build Town',
        mapSquare => {},
        mapSquare => !mapSquare.terrain.isWater,
        {
            requiredUnitSkill: 'townBuilding',
            letterCode: 'B',
            specialCase: true,
        }),
]

class OnGoingOrder {
    type: OnGoingOrderType;
    timeRemaining: number;
    constructor(type, timeRemaining:number|false = false) {
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

        return new OnGoingOrder(
            onGoingOrderTypes.filter(type => type.name === data.type)[0],
            data.timeRemaining
        )
    }
}

export { onGoingOrderTypes, OnGoingOrder }