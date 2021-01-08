
const logToConsole = true
const loggingLevel = 4

function debugLog() {
    if (logToConsole) {
        console.log(...arguments)
    }
}

const debugLogAtLevel = level => {
    return level <= loggingLevel
        ? debugLog
        : ()=>{}
}

export { debugLog, debugLogAtLevel }