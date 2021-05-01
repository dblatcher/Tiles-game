
import { BuildingType } from '../game-entities/BuildingType'
import { Citizen } from '../game-entities/Citizen'
import { citizenJobs } from '../game-entities/CitizenJob'
import { GameState } from '../game-entities/GameState'
import { MapSquare } from '../game-entities/MapSquare'
import { Town } from '../game-entities/Town'
import { UnitType } from '../game-entities/UnitType'

const townActions = {

    MAP_CLICK: (input: { town: Town, mapSquare: MapSquare }) => (state: GameState) => {
        const { town, mapSquare } = input

        const freeSquares = town.getSquaresAndObstacles(state.mapGrid, state.towns, state.units).freeSquares

        const myCitizenOnThatSquareAlready = town.citizens
            .filter(citizen => { return citizen.mapSquare === mapSquare })[0]

        const nonWorkerCitizens = town.citizens
            .filter(citizen => citizen.job !== citizenJobs.worker)

        if (mapSquare === town.mapSquare) {
            town.autoAssignFreeCitizens(state)
        } else if (myCitizenOnThatSquareAlready) {
            myCitizenOnThatSquareAlready.changeJob()
        } else if (!freeSquares.includes(mapSquare)) {
            // do nothing - square is occupied
        } else if (nonWorkerCitizens.length) {
            nonWorkerCitizens[0].putToWorkInSquare(mapSquare)
        } else {
            town.citizens[0].putToWorkInSquare(mapSquare)
        }


        return state
    },

    CITIZEN_CLICK: (input: { town: Town, citizen: Citizen }) => (state: GameState) => {
        const { town, citizen } = input;
        citizen.changeJob()
        return state
    },

    PRODUCTION_PICK: (input: { town: Town, item: UnitType | BuildingType }) => (state: GameState) => {
        const { town, item } = input
        town.isProducing = item
        return state
    },

    HURRY_PRODUCTION: (input:{town:Town}) => (state: GameState) => {
        const { town } = input
        if (!town.canHurryProduction) { return {} }

        town.faction.treasury -= (town.costToHurryProduction as number);
        town.productionStore = town.isProducing.productionCost

        return state
    },
}

export default townActions