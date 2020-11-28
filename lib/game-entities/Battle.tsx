import { Unit } from './Unit';
import { MapSquare } from './MapSquare';
import { Town } from './Town'


class Battle {
    attacker: Unit
    defenders: Array<Unit>;
    mapSquare: MapSquare;
    attackerWon: boolean;
    town: Town | null

    constructor(attacker, defenders, mapSquare, town = null) {
        this.attacker = attacker
        this.defenders = defenders.sort((a, b) => b.type.defend - a.type.defend)
        this.mapSquare = mapSquare
        this.town = town
        this.attackerWon = undefined
    }

    get type() { return 'Battle' }

    get defence () {
        const defenderType = this.defenders[0].type;
        let score = defenderType.defend
        let breakdown = [`${defenderType.defend} defense`]

        if (this.defenders[0].vetran) { 
            breakdown.push(`vetran: +50%`) 
            score += defenderType.defend / 2
        }


        let townBonus = 0, townBonusDescription = "", squareBonus = 0, squareBonusDescription = ""

        if (this.town) {
            if (this.attacker.type.isEffectiveAgainstTowns) {
                townBonusDescription = `town vs ${this.attacker.type.name}: 0%`
            } else if (this.town.hasBuilding('cityWalls')) {
                townBonus = 1
                townBonusDescription = `City Walls: +100%`
            } else {
                townBonus = .5
                townBonusDescription = `Town: +50%`
            }
        }

        if (this.town && this.attacker.type.isEffectiveAgainstTowns) {
            squareBonusDescription = `town vs ${this.attacker.type.name}: 0%`
        } else if (this.mapSquare.defenseBonus > 0) {
            squareBonusDescription = `${this.mapSquare.description}: +${this.mapSquare.defenseBonus * 100}%`
            squareBonus = this.mapSquare.defenseBonus
        }

        if (townBonusDescription || squareBonusDescription) {
            score += defenderType.defend * Math.max(townBonus, squareBonus)
            breakdown.push ( squareBonus > townBonus ? squareBonusDescription : townBonusDescription)
        }


        if (this.defenders[0].onGoingOrder && this.defenders[0].onGoingOrder.type.name === "Fortified") {
            score += defenderType.defend * .5
            breakdown.push(`Fortified: +50%`)
        }

        if (defenderType.hasDefenseBonusVsMounted && this.attacker.type.isMounted) {
            score += defenderType.defend * .5
            breakdown.push(`bonus vs mounted: +50%`)
        }

        return { score, breakdown }
    }


    get attack() {
        let score = this.attacker.type.attack
        let breakdown = [`${this.attacker.type.attack} attack`]
        if (this.attacker.vetran) { 
            score += this.attacker.type.attack / 2 
            breakdown.push(`vetran: +50%`)
        }

        return { score, breakdown }
    }

    get outcome() {
        if (typeof this.attackerWon == 'undefined') { return undefined }

        else return {
            attackerWon: this.attackerWon,
            winner: this.attackerWon ? this.attacker : this.defenders[0],
            loser: !this.attackerWon ? this.attacker : this.defenders[0],
        }
    }

    resolve() {
        let defenseRoll = this.defence.score * Math.random()
        let attackRoll = this.attack.score * Math.random()
        this.attackerWon = attackRoll > defenseRoll
        return this.outcome
    }

}

export { Battle }