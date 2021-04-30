import { MapSquare } from './game-entities/MapSquare'
import { Unit } from './game-entities/Unit'
import { Faction } from './game-entities/Faction'
import { Town } from './game-entities/Town'
import { GameState } from './game-entities/GameState'



class SerialisedGame {

    mapGrid: MapSquare[][]
    factions: Faction[]
    units: Unit[]
    towns: Town[]
    activeFaction: string
    turnNumber: number

    constructor(state, fromJSON = false) {
        const {
            mapGrid, factions, units, towns, activeFaction
        } = state

        if (fromJSON) {
            this.mapGrid = state.mapGrid
            this.factions = state.factions
            this.units = state.units
            this.towns = state.towns
            this.activeFaction = state.activeFaction
            this.turnNumber = state.turnNumber

        } else if (!fromJSON) {
            this.mapGrid = MapSquare.serialiseGrid(mapGrid)
            this.factions = factions.map(faction => faction.serialised)
            this.units = units.map(unit => unit.serialised)
            this.towns = towns.map(town => town.serialised)
            this.activeFaction = activeFaction.name
            this.turnNumber = state.turnNumber
        }

    }

    deserialise() {
        const {
            mapGrid, factions, units, towns, activeFaction, turnNumber
        } = this
        let state:any = {}

        state.mapGrid = MapSquare.deserialiseGrid(mapGrid)
        state.factions = factions.map(data => Faction.deserialise(data))
        state.units = units.map(data => Unit.deserialise(data, state.factions))
        state.towns = towns.map(data => Town.deserialise(data, state.factions, state.units, state.mapGrid))

        const unitMap = {}
        state.units.forEach(unit => { unitMap[unit.indexNumber] = unit })

        state.units.forEach(unit => {
            if (typeof unit.isPassengerOf === 'number') {
                unit.boardTransport(unitMap[unit.isPassengerOf])
            }
        })



        state.activeFaction = state.factions.find(faction => faction.name === activeFaction)

        state.selectedUnit = state.units
            .filter(unit => unit.faction === state.activeFaction )
            .find(unit => !unit.canMakeNoMoreMoves) || null

        state.turnNumber = turnNumber
        return state as GameState
    }
}

export { SerialisedGame }