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

        if (this.mapSquare.defenseBonus > 0 && this.town) {
            score += defenderType.defend * Math.max(this.mapSquare.defenseBonus, .5)
            breakdown.push(this.mapSquare.defenseBonus > .5
                ? `town on ${this.mapSquare.description}: +${this.mapSquare.defenseBonus * 100}%`
                : `town: +50%`
            )
        } else if (this.mapSquare.defenseBonus > 0) { 
            score += defenderType.defend * this.mapSquare.defenseBonus 
            breakdown.push(`${this.mapSquare.description}: +${this.mapSquare.defenseBonus * 100}%`)
        } else if (this.town) { 
            score += defenderType.defend * .5 
            breakdown.push(`town: +50%`)
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