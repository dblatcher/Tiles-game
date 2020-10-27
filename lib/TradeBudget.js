const valueNames = ["treasury", "research", "entertainment"]

function TradeBudget() {
    this.locked = {}
    valueNames.forEach(valueName => {
        this.locked[valueName] = false
    })
}

Object.defineProperty(TradeBudget.prototype, "store", {
    value: {
        treasury: 1 / 3,
        research: 1 / 3,
        entertainment: 1 / 3,
    }
});

Object.defineProperty(TradeBudget.prototype, "displayPercentage", {
    get() {
        let displayValues = {}
        valueNames.forEach(valueName => {
            displayValues[valueName] = (this.store[valueName] * 100).toFixed(0) + '%';
        })
        return displayValues
    }
})

valueNames.forEach(valueName => {

    Object.defineProperty(TradeBudget.prototype, valueName, {
        get() {
            return this.store[valueName];
        },
        set(newAmount) {

            newAmount = Number(newAmount)
            if (isNaN(newAmount)) {
                console.warn('value not number', valueName, newAmount)
                return false
            }

            if (newAmount > 1 || newAmount < 0) {
                console.warn('value out of bounds', valueName, newAmount)
                return false
            }
            const { store, locked } = this;

            const lockedOtherValues   = valueNames.filter(otherValue => otherValue !== valueName &&  locked[otherValue])
            const unlockedOtherValues = valueNames.filter(otherValue => otherValue !== valueName && !locked[otherValue])

            let difference = store[valueName] - newAmount

            if (lockedOtherValues.length === 0) {
                if (newAmount === 1) {
                    unlockedOtherValues.forEach((otherValue) => {
                        store[otherValue] = 0
                    })
                } else {
                    const otherValueProportions = unlockedOtherValues.map(otherValue => {
                        if (store[valueName] === 1) {
                            return 1 / unlockedOtherValues.length
                        }
                        return store[otherValue] / (1 - store[valueName])
                    })

                    unlockedOtherValues.forEach((otherValue, index) => {
                        store[otherValue] = store[otherValue] + difference * otherValueProportions[index]
                    })
                }
                store[valueName] = newAmount;
            } else if (unlockedOtherValues.length > 0) {

                let availableAmount = 1
                lockedOtherValues.forEach(lockedValue => { availableAmount -= store[lockedValue] })

                if (newAmount >= availableAmount) {
                    store[valueName] = availableAmount;
                    unlockedOtherValues.forEach(unlockedValue => { store[unlockedValue] = 0 })
                } else {
                    store[valueName] = newAmount;
                    availableAmount -= newAmount;

                    // this only distrobutes the availble properly becuase there are only 3 values
                    // unlockedOtherValues.length is never higher than 1
                    unlockedOtherValues.forEach((otherValue) => {
                        store[otherValue] = availableAmount / unlockedOtherValues.length
                    })
                }
            }

            return store[valueName]
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
        console.warn('value total out of bounds', sum, inputObject)
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
        output[valueName] = Math.floor(this.store[valueName] * totalTrade)
        amountAllocated += output[valueName]
    })

    let remainder = totalTrade - amountAllocated
    // dump remainder into first value - not best
    output[valueNames[0]] += remainder
    output.totalTrade = totalTrade
    return output
}

export default TradeBudget

