import { randomInt } from "../utility"

class ContinentSizes {
    maxOceanSize: number
    minOceanSize: number
    minimumContinentHeight: number
    minimumContinentWidth: number
    maximumContinentWidth: number

    constructor(input) {
        this.maxOceanSize = input.maxOceanSize;
        this.minOceanSize = input.minOceanSize;
        this.minimumContinentHeight = input.minimumContinentHeight;
        this.minimumContinentWidth = input.minimumContinentWidth;
        this.maximumContinentWidth = input.maximumContinentWidth;
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

    constructor(mapWidth, mapHeight, sizes: ContinentSizes, previousContinent: Continent = null) {

        const {
            maxOceanSize = 6,
            minOceanSize = 0,
            minimumContinentHeight = 6,
            minimumContinentWidth = 5,
            maximumContinentWidth = 12
        } = sizes


        this.places = []
        this.height = randomInt(mapHeight, minimumContinentHeight)
        this.y = randomInt(mapHeight - this.height)


        if (!previousContinent) {
            this.width = randomInt(maximumContinentWidth, minimumContinentWidth)
            this.x = randomInt(maxOceanSize, minOceanSize)
        } else {
            this.x = randomInt(maxOceanSize, minOceanSize) + previousContinent.x + previousContinent.width

            this.width = Math.min(
                randomInt(maximumContinentWidth, minimumContinentWidth),
                mapWidth - this.x
            )
        }

        let widthAtLongitude = 0, coastLatitude = 0
        for (let y = 0; y < this.height; y++) {

            widthAtLongitude = randomInt(this.width) + 1
            coastLatitude = randomInt(this.width - widthAtLongitude)

            for (let x = coastLatitude; x <= coastLatitude + widthAtLongitude; x++) {
                if (x + this.x < mapWidth && y + this.y < mapHeight) {
                    this.places.push({ x: x + this.x, y: y + this.y })
                }
            }
        }

    }
}

export { Continent, ContinentSizes }