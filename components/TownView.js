import MapSection from "./MapSection";
import ProductionMenu from "./ProductionMenu";
import Window from "./Window";
import SupportedUnitsList from "./SupportedUnitsList";

import styles from "./townView.module.scss";
import { spriteSheets } from "../lib/SpriteSheet.tsx"
import ProgressBox from "./ProgressBox";
import { displayGain, getTurnsToComplete, pluralise } from '../lib/utility'

export default class TownView extends React.Component {

    constructor(props) {
        super(props)
        this.handleMapSectionClick = this.handleMapSectionClick.bind(this)
    }

    handleMapSectionClick(mapSquare) {
        const { town, handleTownAction } = this.props
        return handleTownAction('MAP_CLICK', { mapSquare, town })
    }

    getFoodStoreCaption() {
        const { foodStoreRequiredForGrowth,foodStore } = this.props.town
        const {foodYield} = this.props.town.output
        let figure

        if (foodYield > 0 ) {
            figure = getTurnsToComplete(foodStoreRequiredForGrowth - foodStore, foodYield)
            return `growth in ${figure} ${pluralise('turn', figure)}`
        } else if (foodYield < 0) {
            figure = getTurnsToComplete(foodStore, -foodYield)
            return `starvation in ${figure} ${pluralise('turn', figure)}`
        } else {
            return 'no growth'
        }
    }

    render() {
        const { town, closeTownView, mapGrid, handleTownAction } = this.props

        return (
            <Window title={town.name} buttons={[{ text: 'close', clickFunction: closeTownView }]}>
                <div className={styles.frame}>

                    <section className={[styles.section, styles.black].join(" ")}>
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
                            handleMapSectionClick={this.handleMapSectionClick}
                            xStart={town.x - 2} yStart={town.y - 2}
                            xSpan={5} ySpan={5}
                            town={town} mapGrid={mapGrid} />
                    </section>

                    <section className={styles.section}>
                        <h2>Food{displayGain(town.output.foodYield)} </h2>
                        <ProgressBox
                            current={town.foodStore}
                            target={town.foodStoreRequiredForGrowth}
                            unit="food"
                        />
                        <p>{this.getFoodStoreCaption()}</p>

                        <h2>Production{displayGain(town.output.productionYield)}</h2>
                        <ProgressBox
                            current={town.productionStore}
                            target={town.isProducing ? town.isProducing.productionCost : 0}
                            unit="production"
                        />
                        <ProductionMenu handleTownAction={handleTownAction} town={town} />
                    </section>

                    <section className={styles.section}>
                        <h2>{`${town.supportedUnits.length} units supported`}</h2>
                        <SupportedUnitsList town={town} />
                    </section>
                </div>
            </Window>
        )
    }
}