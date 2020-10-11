class OnGoingOrderType {
    name: String;
    requiredUnitSkill: String;
    letterCode: String;
    applyOutcome: Function;
    timeTaken: number;
    constructor(name, applyOutcome, config = {}) {
        this.name = name
        this.applyOutcome = applyOutcome
        this.requiredUnitSkill = config.requiredUnitSkill || name
        this.letterCode = config.letterCode || name[0]
        this.timeTaken = config.timeTaken || 3
    }
}

const onGoingOrderTypes = [
    new OnGoingOrderType('Build Road', mapSquare => {mapSquare.road = true}, {requiredUnitSkill:'roadBuilding', letterCode:'R'} ),
]

class OnGoingOrder {
    type: OnGoingOrderType;
    timeRemaining: number;
    constructor(type) {
        this.type = type;
        this.timeRemaining = type.timeTaken
    }
}

export {onGoingOrderTypes, OnGoingOrder}