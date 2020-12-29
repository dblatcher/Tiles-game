import { randomInt } from "../utility"

class ContinentSizes {
    maxOceanSize: number
    minOceanSize: number
    minimumContinentHeight: number
    minimumContinentWidth: number
    maximumContinentWidth: number

    constructor(input: any = {}) {
        this.maxOceanSize = input.maxOceanSize || 6;
        this.minOceanSize = input.minOceanSize || 3;
        this.minimumContinentHeight = input.minimumContinentHeight || 6;
        this.minimumContinentWidth = input.minimumContinentWidth || 5;
        this.maximumContinentWidth = input.maximumContinentWidth || 10;
    }
}

class Place {
    x: number
    y: number
}

class Continent {
    places: Place[]
    width: number
    height: number
    x: number
    y: number

    constructor(mapWidth, mapHeight, sizes: ContinentSizes, previousContinents: Continent[] = []) {

        this.places = []
        this.width = 0
        this.height = 0
        this.x = 0
        this.y = 0

        let previousContinent = previousContinents[previousContinents.length - 1] || null

        Continent.placeVertically(this, sizes, mapHeight)
        Continent.placeToRightOf(this, previousContinent, sizes, mapWidth)
        Continent.fillPlaces(this, mapWidth, mapHeight)
    }

    static fillPlaces(continent: Continent, mapWidth: number, mapHeight: number) {
        let widthAtLongitude = 0, coastLeftEdge = 0
        for (let y = 0; y < continent.height; y++) {

            widthAtLongitude = randomInt(continent.width) + 1
            coastLeftEdge = randomInt(continent.width - widthAtLongitude)

            for (let x = coastLeftEdge; x <= coastLeftEdge + widthAtLongitude; x++) {
                if (x + continent.x < mapWidth && y + continent.y < mapHeight) {
                    continent.places.push({ x: x + continent.x, y: y + continent.y })
                }
            }
        }
    }

    static placeToRightOf(continent: Continent, previousContinent: Continent, sizes: ContinentSizes, mapWidth: number) {
        const {
            maxOceanSize, minOceanSize, minimumContinentWidth, maximumContinentWidth
        } = sizes

        if (!previousContinent) {
            continent.width = randomInt(maximumContinentWidth, minimumContinentWidth)
            continent.x = randomInt(maxOceanSize, minOceanSize)
        } else {
            continent.x = randomInt(maxOceanSize, minOceanSize) + previousContinent.x + previousContinent.width
            continent.width = Math.min(
                randomInt(maximumContinentWidth, minimumContinentWidth),
                mapWidth - continent.x
            )
        }
    }

    static placeVertically(continent: Continent, sizes: ContinentSizes, mapHeight: number) {
        continent.height = randomInt(mapHeight, sizes.minimumContinentHeight)
        continent.y = randomInt(mapHeight - continent.height)
    }
}

export { Continent, ContinentSizes }