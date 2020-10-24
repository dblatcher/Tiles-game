import MapSection from "./MapSection";
import styles from "./townView.module.scss";
import { spriteSheets } from "../lib/SpriteSheet.tsx"
import ProductionMenu from "./ProductionMenu";

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
        const { town, closeTownView, mapGrid, handleTownAction } = this.props

        return (
            // to do - make window a reusable component 
            <main className={styles.window}>

                <header className={styles.header}>
                    <h1>{town.name}</h1>
                    <nav className={styles.buttonHolder}>
                        <button className={styles.button} onClick={closeTownView}>close</button>
                    </nav>
                </header>

                <div className={styles.citizenRow}>
                    {town.citizens.map((citizen, index) => {
                        return (
                            <i key={`citizen-${index}`}
                                className={styles.citizenFigure}
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


                <p>
                    <span>
                        {`Food store: ${town.foodStore}(${town.output.foodYield >= 0 ? '+' : ''}${town.output.foodYield})`}
                    </span>
                    <span>
                        {` - ${town.foodStoreRequiredForGrowth} needed to grow.`}
                    </span>
                </p>


                <ProductionMenu handleTownAction={handleTownAction} town={town} />

            </main>
        )
    }
}