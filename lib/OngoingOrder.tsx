class OnGoingOrderType {
    name: String;
    requiredUnitSkill: String;
    letterCode: String;
    applyOutcome: Function;
    checkIsValidForSquare: Function;
    timeTaken: number;
    constructor(name, applyOutcome, checkIsValidForSquare, config = {}) {
        this.name = name
        this.applyOutcome = applyOutcome
        this.checkIsValidForSquare = checkIsValidForSquare || function () { return true }

        this.requiredUnitSkill = config.requiredUnitSkill || name
        this.letterCode = config.letterCode || name[0]
        this.timeTaken = config.timeTaken || 3
    }
}

const onGoingOrderTypes = [
    new OnGoingOrderType('Build Road',
        mapSquare => { mapSquare.road = true },
        mapSquare => !mapSquare.road,
        {
            requiredUnitSkill: 'roadBuilding',
            letterCode: 'R'
        }),
    new OnGoingOrderType('Cut Down Trees',
        mapSquare => { mapSquare.tree = false },
        mapSquare => mapSquare.tree,
        {
            requiredUnitSkill: 'treeCutting',
            letterCode: 'C',
        }),
]

class OnGoingOrder {
    type: OnGoingOrderType;
    timeRemaining: number;
    constructor(type) {
        this.type = type;
        this.timeRemaining = type.timeTaken
    }
}

export { onGoingOrderTypes, OnGoingOrder }