import MapSection from "./MapSection";
import styles from "./townView.module.scss";
import { spriteSheets } from "../lib/SpriteSheet.tsx"

export default class TownView extends React.Component {

    constructor(props) {
        super(props)

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
    }

    handleMapSquareClick(mapSquare) {
        const { town, handleTownAction } = this.props

        return handleTownAction('MAP_CLICK', { mapSquare, town })
    }

    render() {
        const { town, closeTownView, mapGrid } = this.props

        return (
            <main>
                <button onClick={closeTownView}>close</button>

                <h1>{town.name}</h1>
                <div className={styles.citizenRow}>
                    {town.citizens.map((citizen, index) => {
                        return (
                            <i key={`citizen-${index}`}
                                className={styles.sprite}
                                style={spriteSheets.units.getStyleForFrameCalled(citizen.job.name)}
                            />
                        )
                    })}
                </div>
                <MapSection
                    handleMapSquareClick={this.handleMapSquareClick}
                    xStart={town.x - 2} yStart={town.y - 2}
                    xSpan={5} ySpan={5}
                    town={town} mapGrid={mapGrid} />

                <p>{`Food store: ${town.foodStore}(${town.output.foodYield >= 0 ? '+':''}${town.output.foodYield})`}</p>
                <p>{`${town.foodStoreRequiredForGrowth} needed to grow.`}</p>
                <p>Production: {town.productionStore} {`(+${town.output.productionYield})`}</p>

            </main>
        )
    }
}