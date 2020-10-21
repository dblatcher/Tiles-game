import MapSection from "./MapSection";


export default class TownView extends React.Component {

    constructor(props) {
        super(props)

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
    }

    handleMapSquareClick(mapSquare) {
        const { town, handleTownAction } = this.props

        return handleTownAction('MAP_CLICK', {mapSquare, town})
    }

    render() {
        const { town, closeTownView, mapGrid } = this.props

        return (
            <main>
                <button onClick={closeTownView}>close</button>

                <h1>{town.name}</h1>
                <MapSection
                    handleMapSquareClick={this.handleMapSquareClick}
                    xStart={town.x - 2} yStart={town.y - 2}
                    xSpan={5} ySpan={5}
                    town={town} mapGrid={mapGrid} />

                <p>Food store: {town.foodStore}</p>

                <p>citizens</p>
                <ol>
                    {town.citizens.map((citizen, index) => {
                        return (
                        <li key={`citizen-${index}`}>{citizen.job.name}</li>
                        )
                    })}
                </ol>
            </main>
        )
    }
}