import VoidMapSquare from "../lib/VoidMapSquare.tsx";
import MapSection from "./MapSection";


export default class TownView extends React.Component {

    render() {
        const { town, closeTownView, mapGrid } = this.props

        return (
            <main>
                <button onClick={closeTownView}>close</button>

                <h1>{town.name}</h1>
                <MapSection
                    xStart={town.x - 2} yStart={town.y - 2}
                    xSpan={5} ySpan={5}
                    town={town} mapGrid={mapGrid} />
            </main>
        )
    }
}