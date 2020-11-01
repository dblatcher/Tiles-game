let userHasBeenToldThierBrowserHasNoLocalStorage = false
const debugMode = false

function browserHasLocalStorage() {
    if (typeof localStorage !== 'object') {
        if (userHasBeenToldThierBrowserHasNoLocalStorage) { return false }
        alert('This browser does not support local storage - data cannot be saved or restored!')
        userHasBeenToldThierBrowserHasNoLocalStorage = true
        return false
    }
    return true
}

function save(folderName, itemName, data) {
    if (!browserHasLocalStorage) { return false }

    if (!localStorage.getItem(folderName)) {
        localStorage.setItem(folderName, JSON.stringify({}))
    }
    let folder = JSON.parse(localStorage.getItem(folderName))
    folder[itemName] = data
    localStorage.setItem(folderName, JSON.stringify(folder))

    if (debugMode) {
        console.log(`*storage* save for ${folderName}/${itemName}`, data)
    }
}

function clear(folderName, itemName,) {
    if (!browserHasLocalStorage) { return false }
    if (!localStorage.getItem(folderName)) { return false }
    let folder = JSON.parse(localStorage.getItem(folderName))
    if (!folder[itemName]) { return false }

    folder[itemName] = undefined
    localStorage.setItem(folderName, JSON.stringify(folder))
    return true
}

function load(folderName, itemName) {
    if (!browserHasLocalStorage) { return false }

    let data = window.localStorage.getItem(folderName)
    if (!data) { 
        if (debugMode) {
            console.log(`*storage* load for ${folderName}/${itemName} - no result, returning false`)
        }
        return false
    }
    data = JSON.parse(data)
    if (debugMode) {
        console.log(`*storage* load for ${folderName}/${itemName} - returning`, data[itemName])
    }
    return data[itemName]
}

function getItemNames(folderName) {
    if (!browserHasLocalStorage) { return [] }
    if (!localStorage.getItem(folderName)) {
        if (debugMode) {
            console.log(`*storage* getItemName for ${folderName}, no folder, returning`,[])
        }
        return []
    }
    let folder = JSON.parse(localStorage.getItem(folderName))

    if (debugMode) {
        console.log(`*storage* getItemName for ${folderName}, ${folder.length} items`, {folderName, folder})
    }
    return Object.keys(folder)
}

export { save, load, getItemNames, clear, browserHasLocalStorage }