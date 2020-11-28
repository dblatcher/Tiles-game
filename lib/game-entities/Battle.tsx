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

    get defendScore() {
        const defenderType = this.defenders[0].type;
        let score = defenderType.defend
        if (this.defenders[0].vetran) { score += defenderType.defend / 2 }

        if (this.mapSquare.defenseBonus > 0 && this.town) {
            score += defenderType.defend * Math.max(this.mapSquare.defenseBonus, .5)
        }
        else if (this.mapSquare.defenseBonus > 0) { score += defenderType.defend * this.mapSquare.defenseBonus }
        else if (this.town) { score += defenderType.defend * .5 }

        if (this.defenders[0].onGoingOrder && this.defenders[0].onGoingOrder.type.name === "Fortified") {
            score += defenderType.defend * .5
        }

        if (defenderType.hasDefenseBonusVsMounted && this.attacker.type.isMounted) {
            score += defenderType.defend * .5
        }

        // rules question - should terrain defense bonus AND town defense bonus both apply?
        return score
    }

    get defendScoreBreakdown() {
        const defenderType = this.defenders[0].type;
        let breakdown = [`${defenderType.defend} defense`]
        if (this.defenders[0].vetran) { breakdown.push(`vetran: +50%`) }

        if (this.mapSquare.defenseBonus > 0 && this.town) {
            breakdown.push(this.mapSquare.defenseBonus > .5
                ? `town on ${this.mapSquare.description}: +${this.mapSquare.defenseBonus * 100}%`
                : `town: +50%`
            )
        }
        else if (this.mapSquare.defenseBonus > 0) { breakdown.push(`${this.mapSquare.description}: +${this.mapSquare.defenseBonus * 100}%`) }
        else if (this.town) { breakdown.push(`town: +50%`) }

        if (this.defenders[0].onGoingOrder && this.defenders[0].onGoingOrder.type.name === "Fortified") {
            breakdown.push(`Fortified: +50%`)
        }

        if (defenderType.hasDefenseBonusVsMounted && this.attacker.type.isMounted) {
            breakdown.push(`bonus vs mounted: +50%`)
        }

        return breakdown
    }

    get attackScore() {
        let score = this.attacker.type.attack
        if (this.attacker.vetran) { score += this.attacker.type.attack / 2 }
        return score
    }

    get attackScoreBreakdown() {
        let breakdown = [`${this.attacker.type.attack} attack`]
        if (this.attacker.vetran) { breakdown.push(`vetran: +50%`) }
        return breakdown
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
        let defenseRoll = this.defendScore * Math.random()
        let attackRoll = this.attackScore * Math.random()
        this.attackerWon = attackRoll > defenseRoll
        return this.outcome
    }

}

export { Battle }