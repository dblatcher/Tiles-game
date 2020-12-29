import { randomInt } from "../utility"

class LandFormSizes {
    maxOceanSize: number
    minOceanSize: number
    minimumContinentHeight: number
    maximumContinentHeight: number
    minimumContinentWidth: number
    maximumContinentWidth: number

    constructor(input: any = {}) {
        this.maxOceanSize = input.maxOceanSize || 6;
        this.minOceanSize = input.minOceanSize || 3;
        this.minimumContinentHeight = input.minimumContinentHeight || 6;
        this.maximumContinentHeight = input.maximumContinentHeight || 1000;
        this.minimumContinentWidth = input.minimumContinentWidth || 5;
        this.maximumContinentWidth = input.maximumContinentWidth || 10;
    }
}

class Place {
    x: number
    y: number
}

class LandForm {
    places: Place[]
    width: number
    height: number
    x: number
    y: number

    constructor() {
        this.places = []
        this.width = 0
        this.height = 0
        this.x = 0
        this.y = 0
    }

    static fillPlaces(landform: LandForm, mapWidth: number, mapHeight: number, minimumWidthAtLongitude: number = 0) {
        let widthAtLongitude = 0, coastLeftEdge = 0
        for (let y = 0; y < landform.height; y++) {

            widthAtLongitude = randomInt(landform.width, minimumWidthAtLongitude) + 1
            coastLeftEdge = randomInt(landform.width - widthAtLongitude)

            for (let x = coastLeftEdge; x <= coastLeftEdge + widthAtLongitude; x++) {
                if (x + landform.x < mapWidth && y + landform.y < mapHeight) {
                    landform.places.push({ x: x + landform.x, y: y + landform.y })
                }
            }
        }
    }

    static placeToRightOf(landform: LandForm, previousLandForm: LandForm, sizes: LandFormSizes, mapWidth: number) {
        const {
            maxOceanSize, minOceanSize, minimumContinentWidth, maximumContinentWidth
        } = sizes

        if (!previousLandForm) {
            landform.width = randomInt(maximumContinentWidth, minimumContinentWidth)
            landform.x = randomInt(maxOceanSize, minOceanSize)
        } else {
            landform.x = randomInt(maxOceanSize, minOceanSize) + previousLandForm.x + previousLandForm.width
            landform.width = Math.min(
                randomInt(maximumContinentWidth, minimumContinentWidth),
                mapWidth - landform.x
            )
        }
    }

    static placeVertically(landform: LandForm, sizes: LandFormSizes, mapHeight: number) {
        landform.height = randomInt(Math.min(mapHeight, sizes.maximumContinentHeight), sizes.minimumContinentHeight)
        landform.y = randomInt(mapHeight - landform.height)
    }

}

class Continent extends LandForm {

    constructor(mapWidth, mapHeight, sizes: LandFormSizes, previousLandForms: LandForm[] = []) {
        super()
        let previousContinent = previousLandForms[previousLandForms.length - 1] || null

        LandForm.placeVertically(this, sizes, mapHeight)
        LandForm.placeToRightOf(this, previousContinent, sizes, mapWidth)
        LandForm.fillPlaces(this, mapWidth, mapHeight)
    }

}

class Pangea extends LandForm {
    constructor(mapWidth, mapHeight) {
        super()

        let sizes = new LandFormSizes({
            maxOceanSize: 5,
            minOceanSize: 2,
            minimumContinentHeight: Math.round(mapHeight * .6),
            maximumContinentHeight: Math.round(mapHeight * .8),
            minimumContinentWidth: Math.round(mapWidth * .8),
            maximumContinentWidth: Math.round(mapWidth * .95),
        })

        LandForm.placeVertically(this, sizes, mapHeight)
        LandForm.placeToRightOf(this, null, sizes, mapWidth)
        LandForm.fillPlaces(this, mapWidth, mapHeight, Math.round(this.width * .8))

    }
}

class IceCap extends LandForm {
    constructor(mapWidth: number, mapHeight: number, isSouth: boolean) {
        super()

        this.width = mapWidth
        this.height = 1
        this.y = isSouth ? mapHeight - 1 : 0

        for (let x = 0; x < this.width; x++) {
            this.places.push({ x, y: this.y })
        }
    }
}

export { LandForm, Continent, LandFormSizes, IceCap, Pangea }