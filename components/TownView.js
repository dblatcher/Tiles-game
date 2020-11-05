import MapSection from "./MapSection";
import ProductionMenu from "./ProductionMenu";
import Window from "./Window";
import SupportedUnitsList from "./SupportedUnitsList";
import TradeReport from "./TradeReport";
import ProgressBox from "./ProgressBox";
import CitizenRow from "./CitizenRow";

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

    getFoodStoreCaption() {
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

                    <section className={[styles.section, styles.black].join(" ")}>
                        <CitizenRow town={town}/>
                        <MapSection
                            handleMapSectionClick={this.handleMapSectionClick}
                            xStart={town.x - 2} yStart={town.y - 2}
                            xSpan={5} ySpan={5}
                            town={town} mapGrid={mapGrid} towns={towns} />
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


                        <h2>Trade{displayGain(town.output.tradeYield)}</h2>
                        <TradeReport town={town} townView={true} />


                    </section>

                    <section className={styles.section}>
                        <h2>{`Buildings`}</h2>
                        <ul>
                            {town.buildings.map(buildingType => {
                                return (
                                    <li key={`buildingListItem-${buildingType.name}`}>
                                        <span>{buildingType.name}</span>
                                        <span>{` ${buildingType.maintenanceCost}/turn`}</span>
                                    </li>
                                )
                            })}
                        </ul>
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