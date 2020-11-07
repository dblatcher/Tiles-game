import { Unit } from './Unit';
import { MapSquare } from './MapSquare';


class Battle {
    attacker: Unit
    defenders: Array<Unit>;
    mapSquare: MapSquare;
    attackerWon: boolean;

    constructor(attacker, defenders, mapSquare) {
        this.attacker = attacker
        this.defenders = defenders.sort((a, b) => b.type.defend - a.type.defend)
        this.mapSquare = mapSquare
        this.attackerWon = undefined
    }

    get type() {return 'Battle'}

    get defendScore() {
        let score = this.defenders[0].type.defend
        if (this.defenders[0].vetran) {score += this.defenders[0].type.defend/2}
        return score
    }

    get defendScoreBreakdown() {
        let breakdown = [`${this.defenders[0].type.defend} attack`]
        if (this.defenders[0].vetran) {breakdown.push(`vetran: +50%`)}
        return breakdown
    }

    get attackScore() {
        let score = this.attacker.type.attack
        if (this.attacker.vetran) {score += this.attacker.type.attack/2}
        return score
    }

    get attackScoreBreakdown() {
        let breakdown = [`${this.attacker.type.attack} attack`]
        if (this.attacker.vetran) {breakdown.push(`vetran: +50%`)}
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