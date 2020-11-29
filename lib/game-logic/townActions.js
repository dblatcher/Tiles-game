
import { citizenJobs } from '../game-entities/CitizenJob.tsx'

const townActions = {

    MAP_CLICK: input => state => {
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

    CITIZEN_CLICK: input => state => {
        const {town, citizen} = input;
        citizen.changeJob()
        return state
    },

    PRODUCTION_PICK: input => state => {
        const { town, item } = input
        town.isProducing = item
        return state
    },

    HURRY_PRODUCTION: input => state => {
        const {town} = input
        if (!town.canHurryProduction) {return {}}

        town.faction.treasury -= town.costToHurryProduction
        town.productionStore = town.isProducing.productionCost

        return {
            towns: state.towns,
            factions: state.factions
        }
    },
}

export default townActions