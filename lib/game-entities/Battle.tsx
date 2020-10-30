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
        return this.defenders[0].type.defend
    }

    get attackScore() {
        return this.attacker.type.attack
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