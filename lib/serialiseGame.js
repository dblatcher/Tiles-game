import { MapSquare } from './game-entities/MapSquare.tsx'
import { terrainTypes } from './game-entities/TerrainType.tsx'
import { unitTypes, Unit } from './game-entities/Unit.tsx'
import { Faction } from './game-entities/Faction.tsx'
import { Town } from './game-entities/Town.tsx'



class SerialisedGame {
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

        } else if (!fromJSON) {
            this.mapGrid = []
            mapGrid.forEach(row => {
                let newRow = []
                row.forEach(mapSquare => {
                    newRow.push(mapSquare.serialised)
                })
                this.mapGrid.push(newRow)
            })

            this.factions = factions.map(faction => faction.serialised)
            this.units = units.map(unit => unit.serialised)
            this.towns = towns.map(town => town.serialised)

            this.activeFaction = activeFaction.name
        }
    }

    deserialise() {
        const {
            mapGrid, factions, units, towns, activeFaction
        } = this
        let state = {}

        state.mapGrid = mapGrid.map(row => {
            return row.map(data => MapSquare.deserialise(data))
        })

        state.factions = factions.map(data => Faction.deserialise(data))
        state.units = units.map(data => Unit.deserialise(data, state.factions))
        state.towns = towns.map(data => Town.deserialise(data, state.factions, state.units, state.mapGrid))

        state.activeFaction = state.factions.filter(faction => faction.name === activeFaction)[0]
        state.activeUnit = null
        return state
    }
}

export { SerialisedGame }