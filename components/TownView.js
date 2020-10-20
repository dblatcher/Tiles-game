import VoidMapSquare from "../lib/VoidMapSquare.tsx";


export default class TownView extends React.Component {

    get localMap() {
        const {town, mapGrid} = this.props
        if (!mapGrid || !town) {return null}

        let localMap = [[],[],[],[],[] ];
        
        for (let y= -2; y<3; y++) {
            if (mapGrid[town.y+y]) {
                for (let x= -2; x<3; x++) {
                    localMap[y+2].push (mapGrid[town.y+y][town.x+x] || new VoidMapSquare(town.y+y,town.x+x))
                }
            } else {
                for (let x= -2; x<3; x++) {
                    localMap[y+2].push(new VoidMapSquare(town.y+y,town.x+x))
                }
            }

        }

        return localMap
    }

    render() {
        const {town, closeTownView,mapGrid} = this.props

        return (
            <main>
                <button onClick={closeTownView}>close</button>

                <h1>{town.name}</h1>

            </main>
        )
    }
}