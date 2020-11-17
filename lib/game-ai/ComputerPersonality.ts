import { Faction } from '../game-entities/Faction.tsx';
import { techDiscoveries } from '../game-entities/TechDiscovery.tsx';

import gameActions from '../game-logic/gameActions'

class ComputerPersonality {
    faction: Faction;
    config: any;
    constructor(faction: Faction, config: any) {
        this.faction = faction
        this.config = config
    }

    manageTowns(state) {
        console.log(`** ${this.faction.name} AI is managing its towns`)
        const myTowns = state.towns.filter(town => town.faction === this.faction)

        myTowns.forEach(town => {
            console.log(`*** managaging ${town.name}`)
            //TO DO assign citizens and set production
        })
    }

    pickNewTech(state) {
        const possibleChoices = Object.keys(techDiscoveries)
            .map(techName => techDiscoveries[techName])
            .filter(tech => tech.checkCanResearchWith(this.faction.knownTech))

        console.log(`** ${this.faction.name} AI needs to pick new tech.`, { possibleChoices })

        //TO DO - logic for computer picking a tech
        const choosenTechDiscovery = possibleChoices[0]

        console.log(`*** ${this.faction.name} AI is taking ${choosenTechDiscovery.name}`)
        gameActions.CHOOSE_RESEARCH_GOAL({ activeFaction: this.faction, techDiscovery: choosenTechDiscovery })(state)
    }

    makeMove (state) {
        const func =  async (state:any) => {
            console.log(`** ${this.faction.name} AI is making a move`)
            // TO DO - move units!
        }
        return func(state)
    }

    checkIfFinished(state, movesMade) {
        let result = movesMade > 2
        // TO DO logic to check has finished turn

        console.log(`** has ${this.faction.name} finished turn after ${movesMade} moves?`, result)
        return result
    }
}



export { ComputerPersonality }