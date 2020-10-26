const valueNames = ["treasury", "research", "entertainment"]

function TradeBudget() {
    this.locked = {}
    valueNames.forEach(valueName => {
        this.locked[valueName] = false
    })
}

Object.defineProperty(TradeBudget.prototype, "store", {
    value: {
        treasury: 1/3,
        research: 1 / 3,
        entertainment: 1 / 3,
    }
});

valueNames.forEach(valueName => {

    Object.defineProperty(TradeBudget.prototype, valueName, {
        get() {
            return this.store[valueName];
        },
        set(newAmount) {
            if (newAmount > 1 || newAmount < 0) { 
                console.warn ('value out of bounds', valueName, newAmount)
                return false 
            }
            const { store } = this;
            //assume no locking for now

            const otherValues = valueNames.filter(otherValue => otherValue !== valueName)
            let difference = store[valueName] - newAmount

            const otherValueProportions = otherValues.map(otherValue => {
                return store[otherValue] / (1 - store[valueName])
            })


            otherValues.forEach((otherValue, index) => {
                store[otherValue] = store[otherValue] + difference * otherValueProportions[index]
            })
            store[valueName] = newAmount;

            return newAmount
        }
    });

})

TradeBudget.prototype.setAll = function (inputObject) {
    const { store } = this;

    let sum = 0
    valueNames.forEach(valueName => {
        sum += inputObject[valueName]
    })

    if (sum !== 1) {
        console.warn ('value total out of bounds', sum, inputObject)
        return store 
    }

    valueNames.forEach(valueName => {
        store[valueName] = inputObject[valueName]
    })
    return store
}

TradeBudget.prototype.allocate = function (totalTrade) {
    let output = {}
    let amountAllocated = 0
    valueNames.forEach(valueName => {
        output[valueName] = Math.floor (this.store[valueName] * totalTrade)
        amountAllocated += output[valueName]
    })

    let remainder = totalTrade - amountAllocated
    // dump remainder into first value - not best
    output[valueNames[0]] += remainder
    output.totalTrade = totalTrade
    return output
}

export default TradeBudget

