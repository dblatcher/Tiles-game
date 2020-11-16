import { Faction } from './Faction'
import { MapSquare } from './MapSquare'
import { Unit, UnitType } from './Unit.tsx'
import { citizenJobs } from './CitizenJob.tsx'
import { Citizen } from './Citizen.tsx'
import { unitTypes } from './Unit.tsx'
import { BuildingType, buildingTypes } from './BuildingType.tsx'

let townIndex = 0

// TO DO - create config module for constants like this?
const hurryCostPerUnit = 5

class Town {
    faction: Faction;
    mapSquare: MapSquare;
    indexNumber: number;
    name: string;
    foodStore: number;
    productionStore: number;
    isProducing: UnitType | BuildingType | null;
    citizens: Array<Citizen>;
    supportedUnits: Array<Unit>;
    buildings: Array<BuildingType>
    constructor(faction: Faction, mapSquare: MapSquare, config: any = {}) {
        this.faction = faction;
        this.mapSquare = mapSquare;

        this.indexNumber = typeof config.indexNumber === 'number'
            ? config.indexNumber
            : townIndex++

        this.name = config.name || `TOWN#${townIndex}-${faction.name}`
        this.foodStore = config.foodStore || 0
        this.productionStore = config.productionStore || 0
        this.isProducing = config.isProducing || null

        if (config.citizens) {
            this.citizens = config.citizens
        } else {
            const population = config.population || 1
            this.citizens = []
            for (let i = 0; i < population; i++) {
                this.citizens.push(new Citizen())
            }
        }

        this.supportedUnits = config.supportedUnits || []
        this.buildings = config.buildings || []
    }

    get x() { return this.mapSquare.x }
    get y() { return this.mapSquare.y }
    get population() { return this.citizens.length }
    get foodStoreRequiredForGrowth() { return (this.population + 1) * 10 }

    get canHurryProduction() {
        return (this.costToHurryProduction !== false) && (this.costToHurryProduction <= this.faction.treasury)
    }

    get output() {
        let output = {
            foodYield: this.mapSquare.foodYield,
            productionYield: this.mapSquare.productionYield,
            tradeYield: this.mapSquare.tradeYield
        }
        this.citizens.forEach(citizen => {
            const { foodYield = 0, productionYield = 0, tradeYield = 0 } = citizen.getOutput(this)
            output.foodYield += foodYield
            output.productionYield += productionYield
            output.tradeYield += tradeYield
        })


        output.productionYield -= this.supportedUnits.length
        output.foodYield -= this.population * 2

        return output
    }

    get buildingMaintenanceCost() {
        let cost = 0
        this.buildings.forEach(buildingType => cost += buildingType.maintenanceCost)
        return cost
    }

    get costToHurryProduction() {
        if (!this.isProducing) { return false }
        if (this.productionStore >= this.isProducing.productionCost) { return false }
        return (this.isProducing.productionCost - this.productionStore) * hurryCostPerUnit
    }

    get productionItemName() {
        if (!this.isProducing) { return 'nothing' }
        return this.isProducing.displayName
    }

    getSquaresAndObstacles(mapGrid, towns, units=[]) {
        const { x, y } = this.mapSquare
        let row, col, townIndex, citizenIndex, unitIndex, squares = [], obstacle = null, obstacles = [];

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

                    for (unitIndex = 0; unitIndex < units.length; unitIndex++) {
                        if (
                            units[unitIndex].faction !== this.faction &&
                            units[unitIndex].x === col &&
                            units[unitIndex].y === row &&
                            units[unitIndex].onGoingOrder && 
                            units[unitIndex].onGoingOrder.type.name === "Fortified"
                        ) {
                            obstacle = units[unitIndex]
                            break;
                        }
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

    getOccupierMap(mapGrid, towns, units=[]) {
        const { squares, obstacles } = this.getSquaresAndObstacles(mapGrid, towns, units)
        let result = []

        for (let i = 0; i < obstacles.length; i++) {
            if (!obstacles[i]) { continue }
            if (this.citizens.includes(obstacles[i])) { continue }
            result.push({ mapSquare: squares[i], obstacle: obstacles[i] })
        }

        return result
    }

    autoAssignCitizen(citizen, state) {
        const { mapGrid, towns, units } = state
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns, units).freeSquares
        citizen.putToWorkInSquare(freeSquares.shift())
        return citizen
    }

    autoAssignFreeCitizens(state) {
        const { mapGrid, towns, units } = state
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns, units).freeSquares
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
            this.foodStore = this.buildings.includes(buildingTypes.granary)
                ? Math.floor(this.foodStore / 2)
                : 0

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
            notices.push(`${this.name} has finished building ${this.productionItemName}`)

            if (this.isProducing.classIs === 'UnitType') {
                const newUnit = new Unit(this.isProducing, this.faction, { 
                    x: this.x, 
                    y: this.y, 
                    vetran: this.buildings.includes(buildingTypes.barracks)
                })
                if (newUnit.townBuilding >0 && this.population > 1) {this.citizens.pop()} 

                state.units.push(newUnit)
                this.supportedUnits.push(newUnit)
            } else if (this.isProducing.classIs === 'BuildingType') {
                this.buildings.push(this.isProducing)
                this.isProducing = null
            }
            this.productionStore = 0
        }

        this.foodStore = Math.max(0, this.foodStore)
        this.productionStore = Math.max(0, this.productionStore)
        return notices
    }

    get serialised() {
        let output = {
            faction: this.faction.name,
            mapSquare: { x: this.mapSquare.x, y: this.mapSquare.y },
            isProducing: this.isProducing ? this.isProducing.name : null, // TO DO - handle producing buildings better
            citizens: this.citizens.map(citizen => citizen.serialised),
            supportedUnits: this.supportedUnits.map(unit => unit.indexNumber),
            buildings: this.buildings.map(buildingType => buildingType.name),
        }
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data, factions, units, mapGrid) {
        const faction = factions.filter(faction => faction.name === data.faction)[0]
        const mapSquare = mapGrid[data.mapSquare.y][data.mapSquare.x]

        return new Town(faction, mapSquare, {
            indexNumber: data.indexNumber,
            name: data.name,
            foodStore: data.foodStore,
            productionStore: data.productionStore,

            isProducing: data.isProducing
                ? unitTypes[data.isProducing] || buildingTypes[data.isProducing] // TO DO - handle producing buildings better - assumes no unit and buildig with same name
                : null,

            citizens: data.citizens.map(datum => Citizen.deserialise(datum, mapGrid)),
            supportedUnits: data.supportedUnits.map(indexNumber => units.filter(unit => unit.indexNumber === indexNumber)[0]),
            buildings: data.buildings.map(buildingTypeName => buildingTypes[buildingTypeName])
        })
    }
}





export { Town }