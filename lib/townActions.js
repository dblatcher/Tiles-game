
import {citizenJobs} from './Town.tsx'

const townActions = {

    mapClick: input => state => {
        const {town, mapSquare} = input

        if (mapSquare === town.mapSquare) {
            return {}
        }

        const citizenOnThatSquareAlready = town.citizens
            .filter(citizen => { return citizen.mapSquare === mapSquare})[0]

        const unemployedCitizens = town.citizens
            .filter(citizen => citizen.job === citizenJobs.unemployed)

        if (citizenOnThatSquareAlready) {
            citizenOnThatSquareAlready.makeUnemployed()
        } else if (unemployedCitizens.length) {
            unemployedCitizens[0].putToWorkInSquare(mapSquare)
        } else {
            town.citizens[0].putToWorkInSquare(mapSquare)
        }


        return state
    },

    productionPick: input => state => {
        const {town, item} = input
        town.isProducing = item

        return state
    }
}

export default townActions