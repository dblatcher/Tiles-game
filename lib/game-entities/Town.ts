import { Faction } from './Faction'
import { MapSquare } from './MapSquare'
import { Unit } from './Unit'
import { UnitType, unitTypes } from './UnitType'
import { citizenJobs } from './CitizenJob'
import { Citizen } from './Citizen'
import { BuildingType, buildingTypes } from './BuildingType'

import { hurryCostPerUnit } from '../game-logic/constants'
import { UNHAPPINESS_ALLOWANCE, UNHAPPINESS_RATE, BASE_POPULATION_LIMIT, MAX_UNHAPPINESS_REDUCTION_FROM_UNITS } from '../game-logic/constants'
import { getTurnsToComplete, areSamePlace } from '../utility'
import { GameState } from './GameState'

let townIndex = 0

// TO DO - create config module for constants like this?


class Town {
    faction: Faction;
    mapSquare: MapSquare;
    indexNumber: number;
    name: string;
    foodStore: number;
    productionStore: number;
    isProducing: UnitType | BuildingType | null;
    citizens: Citizen[];
    supportedUnits: Unit[];
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
    get classIs() { return "Town" }
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

    get baseUnhappiness() {
        return Math.ceil((this.population - UNHAPPINESS_ALLOWANCE) / UNHAPPINESS_RATE)
    }

    getUnitsHere(units: Unit[]) {
        return units
            .filter(unit => unit.faction === this.faction)
            .filter(unit => areSamePlace(unit, this))
    }

    getUnhappinessReduction(units: Unit[]) {
        let value = 0;
        this.buildings.forEach(buildingType => { value += buildingType.reduceUnhappiness })
        value += Math.min(MAX_UNHAPPINESS_REDUCTION_FROM_UNITS, this.getUnitsHere(units).length)
        return value
    }

    getUnhappiness(units: Unit[]) {
        return Math.max(this.baseUnhappiness - this.getUnhappinessReduction(units), 0)
    }

    get happiness() {
        return Math.floor(this.faction.allocateTownRevenue(this).entertainment / 2)
    }

    /** 
    @param units all the units in the GameState, or all this factions' units
    @return whether the town is in revolt
    **/
    getIsInRevolt(units: Unit[]) {
        return this.getUnhappiness(units) > this.happiness
    }

    get buildingMaintenanceCost() {
        let cost = 0
        this.buildings.forEach(buildingType => cost += buildingType.maintenanceCost)
        return cost
    }

    get turnsToCompleteProduction() {
        if (!this.isProducing) { return Infinity }
        return getTurnsToComplete(this.isProducing.productionCost - this.productionStore, this.output.productionYield)
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

    get populationLimit() {
        let value = BASE_POPULATION_LIMIT;
        this.buildings.forEach(buildingType => { value += buildingType.allowExtraPopulation })
        return value
    }

    get turnsToCompleteCurrentProduction() {
        if (!this.isProducing) { return 0 }
        return getTurnsToComplete(this.isProducing.productionCost - this.productionStore, this.output.productionYield)
    }

    getTurnsToComplete(item: UnitType | BuildingType) {
        return getTurnsToComplete(item.productionCost - this.productionStore, this.output.productionYield)
    }

    hasBuilding(name) {
        return this.buildings
            .map(buildingType => buildingType.name)
            .includes(name)
    }

    //TO DO check this works for towns on map edge
    getSquaresAndObstacles(mapGrid, towns, units = []) {
        const { x, y } = this.mapSquare
        let row, col, townIndex, citizenIndex, unitIndex, squares = [], obstacle = null, obstacles = [];

        for (row = y - 2; row <= y + 2; row++) {
            if (mapGrid[row]) {
                for (col = x - 2; col <= x + 2; col++) {
                    if (!mapGrid[row][col]) { continue }     // can't work square off the map
                    if (col === x && row === y) { continue } // can't work home square
                    if (Math.abs(col - x) + Math.abs(row - y) === 4) { continue } // can't work corners

                    squares.push(mapGrid[row][col])
                    obstacle = null
                    for (townIndex = 0; townIndex < towns.length; townIndex++) {
                        for (citizenIndex = 0; citizenIndex < towns[townIndex].citizens.length; citizenIndex++) {
                            if (mapGrid[row][col] === towns[townIndex].citizens[citizenIndex].mapSquare) {
                                obstacle = {
                                    citizen: towns[townIndex].citizens[citizenIndex],
                                    town: towns[townIndex]
                                };
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

    getOccupierMap(mapGrid, towns, units = []) {
        const { squares, obstacles } = this.getSquaresAndObstacles(mapGrid, towns, units)
        let result = []

        for (let i = 0; i < obstacles.length; i++) {
            if (!obstacles[i]) { continue }
            if (obstacles[i].citizen && this.citizens.includes(obstacles[i].citizen)) { continue }
            result.push({ mapSquare: squares[i], obstacle: obstacles[i] })
        }

        return result
    }

    autoAssignCitizen(citizen, state) {
        const { mapGrid, towns, units } = state
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns, units).freeSquares
            .sort((squareA, squareB) => {
                return (squareB.foodYield + squareB.tradeYield + squareB.productionYield) - (squareA.foodYield + squareA.tradeYield + squareA.productionYield)
            })

        citizen.putToWorkInSquare(freeSquares.shift())
        return citizen
    }

    autoAssignFreeCitizens(state) {
        const { mapGrid, towns, units } = state
        // TO DO - set priorites eg maximise production without starving
        let freeSquares = this.getSquaresAndObstacles(mapGrid, towns, units).freeSquares
            .sort((squareA, squareB) => {
                return (squareB.foodYield + squareB.tradeYield + squareB.productionYield) - (squareA.foodYield + squareA.tradeYield + squareA.productionYield)
            })

        let freeCitizens = this.citizens.filter(citizen => citizen.job !== citizenJobs.worker)

        while (freeCitizens.length > 0 && freeSquares.length > 0) {
            freeCitizens.shift().putToWorkInSquare(freeSquares.shift())
        }
        return this
    }

    processTurn(state: GameState) {
        let notices: string[] = []

        if (this.getIsInRevolt(state.units)) {
            notices.push(`Unrest in ${this.name}!`)
        } else {
            this.foodStore += this.output.foodYield
            this.productionStore += this.output.productionYield

            if (this.foodStore < 0 && this.population > 1) {
                this.citizens.pop()
                notices.push(`Starvation in ${this.name}! Population reduced to ${this.population}.`)
            }

            if (this.foodStore >= this.foodStoreRequiredForGrowth) {
                if (this.population < this.populationLimit) {
                    const newCitizen = new Citizen()
                    this.autoAssignCitizen(newCitizen, state)

                    this.citizens.push(newCitizen)
                    this.foodStore = this.buildings.includes(buildingTypes.granary)
                        ? Math.floor(this.foodStore / 2)
                        : 0

                    notices.push(`${this.name} has grown to a population of ${this.population}.`)
                } else {
                    this.foodStore = Math.floor(this.foodStore / 2)
                    notices.push(`${this.name} cannot grow past its population of ${this.population}.`)
                }
            }

            if (this.productionStore < 0 && this.supportedUnits.length > 1) {
                let shortFall = 0 - this.productionStore

                while (shortFall > 0 && this.supportedUnits.length > 0) {
                    notices.push(`${this.name} cannot support  ${this.supportedUnits[0].type.name}. Unit disbanded`)
                    this.supportedUnits[0].removeFromGame(state)
                    shortFall--
                }
            }

            if (this.isProducing && this.productionStore >= this.isProducing.productionCost) {
                notices.push(`${this.name} has finished building ${this.productionItemName}`)

                if (this.isProducing.classIs === 'UnitType') {

                    const newUnitType = this.isProducing as UnitType
                    const vetran = (this.buildings.includes(buildingTypes.barracks) && !newUnitType.isNaval) ||
                        (this.buildings.includes(buildingTypes.harbour) && newUnitType.isNaval)

                    const newUnit = new Unit(newUnitType, this.faction, {
                        x: this.x,
                        y: this.y,
                        vetran
                    })
                    if (newUnit.type.townBuilding > 0 && this.population > 1) { this.citizens.pop() }

                    state.units.push(newUnit)
                    this.supportedUnits.push(newUnit)
                } else if (this.isProducing.classIs === 'BuildingType') {
                    this.buildings.push(this.isProducing as BuildingType)
                    this.isProducing = null
                }
                this.productionStore = 0
            }

        }

        this.foodStore = Math.max(0, this.foodStore)
        this.productionStore = Math.max(0, this.productionStore)
        return notices
    }

    static addNew(state: GameState, mapSquare: MapSquare, faction: Faction, name: string) {
        const newTown = new Town(faction, mapSquare, { name }).autoAssignFreeCitizens(state)
        state.towns.push(newTown)
        mapSquare.road = true
        faction.updateWorldMap(state)
        faction.updatePlacesInSightThisTurn(state)
        return newTown;
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

    static setIndexNumber(value: number = 0) {
        townIndex = value
    }
}





export { Town }