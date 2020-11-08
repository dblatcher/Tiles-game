import MapSection from "./MapSection";
import ProductionMenu from "./ProductionMenu";
import Window from "./Window";
import SupportedUnitsList from "./SupportedUnitsList";
import TradeReport from "./TradeReport";
import ProgressBox from "./ProgressBox";
import CitizenRow from "./CitizenRow";
import TownBuildingList from "./TownBuildingList";

import styles from "./townView.module.scss";
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

    get productionCaption() {
        const {isProducing} = this.props.town
        return isProducing 
            ? `Producing: ${isProducing.displayName}` 
            : `Producing: nothing`
    }

    get foodStoreCaption() {
        const { foodStoreRequiredForGrowth, foodStore } = this.props.town
        const { foodYield } = this.props.town.output
        let figure

        if (foodYield > 0) {
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
        const { town, closeTownView, mapGrid, handleTownAction, towns } = this.props

        return (
            <Window title={`${town.name} - pop.${town.population},000 `} buttons={[{ text: 'close', clickFunction: closeTownView }]}>
                <div className={styles.frame}>

                    <section className={[styles.section, styles.mapSection].join(" ")}>
                        <CitizenRow town={town} />
                        <MapSection
                            handleMapSectionClick={this.handleMapSectionClick}
                            xStart={town.x - 2} yStart={town.y - 2}
                            xSpan={5} ySpan={5}
                            town={town} mapGrid={mapGrid} towns={towns} />
                    </section>

                    <section className={styles.section}>
                        <h2>Food <span>{displayGain(town.output.foodYield)}</span> </h2>
                        <ProgressBox
                            current={town.foodStore}
                            target={town.foodStoreRequiredForGrowth}
                            unit="food"/>
                        <p className={styles.caption}>{this.foodStoreCaption}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>Production<span>{displayGain(town.output.productionYield)}</span></h2>
                        <ProgressBox
                            current={town.productionStore}
                            target={town.isProducing ? town.isProducing.productionCost : 0}
                            unit="production"/>
                        <p className={styles.caption}>{this.productionCaption}</p>
                        <ProductionMenu handleTownAction={handleTownAction} town={town} />
                    </section>

                    <section className={styles.section}>
                        <h2>Trade<span>{displayGain(town.output.tradeYield)}</span></h2>
                        <TradeReport town={town} townView={true} />
                    </section>

                    <section className={styles.section}>
                        <h2>{`Buildings`}</h2>
                        <TownBuildingList town={town} />
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