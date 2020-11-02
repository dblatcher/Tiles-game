
import { citizenJobs } from '../game-entities/CitizenJob.tsx'

const townActions = {

    MAP_CLICK: input => state => {
        const { town, mapSquare } = input

        const freeSquares = town.getSquaresAndObstacles(state.mapGrid, state.towns).freeSquares

        const myCitizenOnThatSquareAlready = town.citizens
            .filter(citizen => { return citizen.mapSquare === mapSquare })[0]

        const unemployedCitizens = town.citizens
            .filter(citizen => citizen.job === citizenJobs.unemployed)

        if (mapSquare === town.mapSquare) {
            town.autoAssignFreeCitizens(state)
        } else if (myCitizenOnThatSquareAlready) {
            myCitizenOnThatSquareAlready.makeUnemployed()
        } else if (!freeSquares.includes(mapSquare)) {
            // do nothing - square is occupied
        } else if (unemployedCitizens.length) {
            unemployedCitizens[0].putToWorkInSquare(mapSquare)
        } else {
            town.citizens[0].putToWorkInSquare(mapSquare)
        }


        return state
    },

    PRODUCTION_PICK: input => state => {
        const { town, item } = input
        town.isProducing = item
        return state
    }
}

export default townActions