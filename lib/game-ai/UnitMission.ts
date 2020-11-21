import { MapSquare } from "../game-entities/MapSquare";
import { getDistanceBetween} from "../utility"

class UnitMissionType {
    name: string;
    checkIfFinished: Function;
    chooseMove: Function;
    constructor(name, checkIfFinished, chooseMove) {
        this.name = name
        this.checkIfFinished = checkIfFinished
        this.chooseMove = chooseMove
    }
}

const unitMissionTypes = {
    goTo: new UnitMissionType('goTo',
        function (unit, state) {
            return unit.x == this.xTarget && unit.y == this.yTarget
        },
        function (unit, state, possibleMoves) {
            // TO DO - proper pathfinding function
            const target = {x: this.xTarget, y:this.yTarget}
            console.log(`${unit.description} is at [${unit.x}, ${unit.y}] and is going to [${target.x}, ${target.y}]`)

            if (unit.x == target.x && unit.y == target.y) {
                return null
            }
            if (possibleMoves.length === 0) { return null }

            possibleMoves = possibleMoves.filter(mapSquare => {
                if (target.x >= unit.x && mapSquare.x < unit.x) { return false }
                if (target.x <= unit.x && mapSquare.x > unit.x) { return false }
                if (target.y >= unit.y && mapSquare.y < unit.y) { return false }
                if (target.y <= unit.y && mapSquare.y > unit.y) { return false }
                return true
            })

            possibleMoves.sort( (mapSquareA, mapSquareB) => getDistanceBetween(mapSquareA, target) - getDistanceBetween(mapSquareB, target) )
            return possibleMoves[0]

        },
    ),
    random: new UnitMissionType('random',
        function (unit, state) {
            return false
        },
        function (unit, state, possibleMoves) {
            console.log(`${unit.description} is at [${unit.x}, ${unit.y}] and is moving at random`)
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        },
    ),
}

class UnitMission {
    type: string;
    xTarget: number | null;
    yTarget: number | null;
    constructor(type: string, config: any = {}) {
        this.type = type
        this.xTarget = config.xTarget || null
        this.yTarget = config.yTarget || null
    }

    checkIfFinished(unit, state) {
        return unitMissionTypes[this.type].checkIfFinished.apply(this,[unit, state])
    }

    chooseMove(unit, state) {

        const { x, y } = unit;
        let possibleMoves = state.mapGrid
            .slice(y - 1, y + 2)
            .map(row => row.slice(x - 1, x + 2))
            .flat()
            .filter(mapSquare => unit.canMoveTo(mapSquare, state.mapGrid[y][x]))

        return unitMissionTypes[this.type].chooseMove.apply(this,[unit, state, possibleMoves])

    }

    get serialised() {
        let output = {}
        Object.keys(this).forEach(key => {
            if (typeof output[key] == 'undefined') { output[key] = this[key] }
        })
        return output
    }

    static deserialise(data) {
        return new UnitMission(data.type, {
            xTarget: data.xTarget,
            yTarget: data.yTarget,
        })
    }
}


export { UnitMission } 