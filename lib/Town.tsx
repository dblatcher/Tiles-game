import { Faction } from './Faction'
import { MapSquare } from './MapSquare'
import { Unit, UnitType } from './Unit.tsx'

let townIndex = 0

class CitizenJob {
    name: string;
    constructor(name) {
        this.name = name
    }
}

const citizenJobs = {
    unemployed: new CitizenJob('unemployed'),
    worker: new CitizenJob('worker'),
}

class Citizen {
    mapSquare: MapSquare | null;
    job: CitizenJob | null;

    constructor(mapSquare = null, job = citizenJobs.unemployed) {
        this.mapSquare = mapSquare
        this.job = job
    }

    putToWorkInSquare(mapSquare: MapSquare) {
        this.mapSquare = mapSquare
        this.job = citizenJobs.worker
    }

    makeUnemployed() {
        this.mapSquare = null
        this.job = citizenJobs.unemployed
    }

    get output() {
        if (this.mapSquare) {
            return {
                foodYield: this.mapSquare.foodYield,
                tradeYield: this.mapSquare.tradeYield,
                productionYield: this.mapSquare.productionYield,
            }
        }

        return {}
    }
}

class Town {
    faction: Faction;
    mapSquare: MapSquare;
    indexNumber: number;
    name: string;
    foodStore: number;
    productionStore: number;
    isProducing: UnitType | null;
    citizens: Array<Citizen>;
    supportedUnits: Array<Unit>;
    constructor(faction: Faction, mapSquare: MapSquare, config: any = {}) {
        this.faction = faction;
        this.mapSquare = mapSquare;
        this.indexNumber = ++townIndex

        this.name = config.name || `TOWN#${townIndex}-${faction.name}`

        const population = config.population || 1
        this.citizens = []
        for (let i = 0; i < population; i++) {
            this.citizens.push(new Citizen())
        }

        this.foodStore = config.foodStore || 0
        this.productionStore = config.productionStore || 0
        this.isProducing = config.isProducing || null
        this.supportedUnits = config.supportedUnits || []
    }

    get x() { return this.mapSquare.x }
    get y() { return this.mapSquare.y }
    get population() { return this.citizens.length }
    get foodStoreRequiredForGrowth() { return (this.population + 1) * 10 }

    get output() {
        let output = {
            foodYield: this.mapSquare.foodYield,
            productionYield: this.mapSquare.productionYield,
            tradeYield: this.mapSquare.tradeYield
        }
        this.citizens.forEach(citizen => {
            const { foodYield = 0, productionYield = 0, tradeYield = 0 } = citizen.output
            output.foodYield += foodYield
            output.productionYield += productionYield
            output.tradeYield += tradeYield
        })


        output.productionYield -= this.supportedUnits.length
        output.foodYield -= this.population * 2

        return output
    }

    getSquaresAndObstacles(mapGrid, towns) {
        const { x, y } = this.mapSquare
        let row, col, townIndex, citizenIndex, squares = [], obstacle = null, obstacles = [];

        for (row = y - 2; row <= y + 2; row++) {
            if (mapGrid[row]) {
                for (col = x - 2; col <= x + 2; col++) {
                    if (!mapGrid[row][col]) { continue }     // can't work square off the map
                    if (col === x && row === y) { continue } // can't work home square
                    if (Math.abs(col - x) + Math.abs(row - y) === 4) { continue } // can't work corners
                    //TO DO - if any non-friendly unit is fortified on square, push to obstacles

                    squares.push(mapGrid[row][col])
                    obstacle = null
                    for (townIndex = 0; townIndex < towns.length; townIndex++) {
                        for (citizenIndex = 0; citizenIndex < towns[townIndex].citizens.length; citizenIndex++) {
                            if (mapGrid[row][col] === towns[townIndex].citizens[citizenIndex].mapSquare) {
                                obstacle = towns[townIndex].citizens[citizenIndex];
                                break;
                            }
                        }
                        if (obstacle) { break }
                    }
                    obstacles.push(obstacle)
                }
            }
        }

        let freeSquares = []
        squares.forEach((mapSquare, index) => {
            if (!obstacles[index]) { freeSquares.push(mapSquare) }
        })

        return { squares, obstacles, freeSquares }
    }

    autoAssignCitizen(citizen, state) {
        const { mapGrid, towns } = state
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns).freeSquares
        citizen.putToWorkInSquare(freeSquares.shift())
        return citizen
    }

    autoAssignFreeCitizens(state) {
        const { mapGrid, towns } = state
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns).freeSquares
        let freeCitizens = this.citizens.filter(citizen => citizen.job === citizenJobs.unemployed)

        // TO DO - set priorites eg maximise production without starving
        freeSquares.sort((squareA, squareB) => {
            return (squareB.foodYield + squareB.tradeYield + squareB.productionYield) - (squareA.foodYield + squareA.tradeYield + squareA.productionYield)
        })

        while (freeCitizens.length > 0 && freeSquares.length > 0) {
            freeCitizens.shift().putToWorkInSquare(freeSquares.shift())
        }
        return this
    }

    processTurn(state) {
        let notices = []

        this.foodStore += this.output.foodYield
        this.productionStore += this.output.productionYield

        if (this.foodStore < 0 && this.population > 1) {
            this.citizens.pop()
            notices.push(`Starvation in ${this.name}! Population reduced to ${this.population}.`)
        }

        if (this.foodStore >= this.foodStoreRequiredForGrowth) {
            const newCitizen = new Citizen()
            this.autoAssignCitizen(newCitizen, state)

            this.citizens.push(newCitizen)
            this.foodStore = 0
            notices.push(`${this.name} has grown to a population of ${this.population}.`)
        }

        if (this.productionStore < 0 && this.supportedUnits.length > 1) {
            let shortFall = 0 - this.productionStore

            while (shortFall > 0 && this.supportedUnits.length > 0) {
                notices.push(`${this.name} cannot support  ${this.supportedUnits[0].type.name}. Unit disbanded`)
                state.units.splice(state.units.indexOf(this.supportedUnits[0]), 1)
                this.supportedUnits.shift()
                shortFall--
            }
        }

        if (this.isProducing && this.productionStore >= this.isProducing.productionCost) {
            notices.push(`${this.name} has finished building ${this.isProducing.name}`)

            // to do - reduce population if unit is 'settler' (has townBuilding > 0)
            // to do - add test for type of production item
            const newUnit = new Unit(this.isProducing, this.faction, { x: this.x, y: this.y })
            state.units.push(newUnit)
            this.supportedUnits.push(newUnit)
            this.productionStore = 0
        }

        this.foodStore = Math.max(0, this.foodStore)
        this.productionStore = Math.max(0, this.productionStore)
        return notices
    }

}


export { Town, citizenJobs }