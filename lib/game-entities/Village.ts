import { MapSquare } from "./MapSquare";

let villageIndex = 0

interface VillageConfig {
    indexNumber?: number
}

class Village {
    mapSquare: MapSquare;
    indexNumber: number;

    constructor(mapSquare: MapSquare, config: VillageConfig = {}) {
        this.mapSquare = mapSquare

        this.indexNumber = typeof config.indexNumber === 'number'
            ? config.indexNumber
            : villageIndex++
    }

    get classIs() { return "Village" }
    get x() { return this.mapSquare.x }
    get y() { return this.mapSquare.y }

    get serialised() {
        let output = {
            mapSquare: { x: this.mapSquare.x, y: this.mapSquare.y },
            indexNumber: this.indexNumber
        }
        return output
    }

    static deserialise(data, mapGrid) {
        const mapSquare = mapGrid[data.mapSquare.y][data.mapSquare.x]

        return new Village(mapSquare, {
            indexNumber: data.indexNumber,
        })
    }

    static setIndexNumber(value: number = 0) {
        villageIndex = value
    }
}


export { Village }