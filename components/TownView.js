import MapSection from "./MapSection";
import ProductionMenu from "./ProductionMenu";
import Window from "./Window";
import UnitListBox from "./UnitListBox";
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
        this.handleCitizenClick = this.handleCitizenClick.bind(this)
    }

    handleCitizenClick(citizen) {
        const { stateOfPlay, handleTownAction } = this.props
        return handleTownAction('CITIZEN_CLICK', { citizen, town: stateOfPlay.openTown })
    }

    handleMapSectionClick(mapSquare) {
        const { stateOfPlay, handleTownAction } = this.props
        return handleTownAction('MAP_CLICK', { mapSquare, town: stateOfPlay.openTown })
    }

    get productionCaption() {
        const { isProducing } = this.props.stateOfPlay.openTown
        return isProducing
            ? `Producing: ${isProducing.displayName}`
            : `Producing: nothing`
    }

    get foodStoreCaption() {
        const { foodStoreRequiredForGrowth, foodStore, population, populationLimit } = this.props.stateOfPlay.openTown
        const { foodYield } = this.props.stateOfPlay.openTown.output
        let figure

        if (foodYield > 0 && population < populationLimit) {
            figure = getTurnsToComplete(foodStoreRequiredForGrowth - foodStore, foodYield)
            return `growth in ${figure} ${pluralise('turn', figure)}`
        } else if (foodYield < 0) {
            figure = getTurnsToComplete(foodStore, -foodYield)
            return `starvation in ${figure} ${pluralise('turn', figure)}`
        } else if (population >= populationLimit) {
            return 'max population'
        } else {
            return 'no growth'
        }
    }

    render() {
        const { closeTownView, handleTownAction, openTownView, stateOfPlay } = this.props
        const { mapGrid, towns, units, openTown } = stateOfPlay
        const town = openTown

        const buttonList = [
            { text: 'close', clickFunction: closeTownView },
        ]

        const factionTowns = towns.filter(otherTown => otherTown.faction === town.faction)

        if (factionTowns.length > 1) {
            const indexOfThisTown = factionTowns.indexOf(town)
            const nextTown = factionTowns[indexOfThisTown + 1] || factionTowns[0]
            const previousTown = factionTowns[indexOfThisTown - 1] || factionTowns[factionTowns.length - 1]

            if (nextTown !== town) {
                buttonList.unshift(
                    { text: `${nextTown.name} >`, clickFunction: () => { openTownView(nextTown) } }
                )
            }
            if (previousTown !== town && previousTown !== nextTown) {
                buttonList.unshift(
                    { text: `< ${previousTown.name}`, clickFunction: () => { openTownView(previousTown) } }
                )
            }
        }


        return (
            <Window title={`${town.name} - pop.${town.population},000 `} buttons={buttonList}>
                <div className={styles.frame}>

                    <section className={[styles.section, styles.mapSection].join(" ")}>
                        <CitizenRow stateOfPlay={stateOfPlay} town={town} handleCitizenClick={this.handleCitizenClick} />
                        <MapSection
                            handleMapSectionClick={this.handleMapSectionClick}
                            radius={2}
                            town={town} stateOfPlay={stateOfPlay}
                        />
                    </section>

                    <section className={styles.section}>
                        <h2>Food <span>{displayGain(town.output.foodYield)}</span> </h2>
                        <ProgressBox
                            current={town.foodStore}
                            target={town.foodStoreRequiredForGrowth}
                            unit="food" />
                        <p className={styles.caption}>{this.foodStoreCaption}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>Production<span>{displayGain(town.output.productionYield)}</span></h2>
                        <ProgressBox
                            current={town.productionStore}
                            target={town.isProducing ? town.isProducing.productionCost : 0}
                            unit="production" />
                        <p className={styles.caption}>{this.productionCaption}</p>
                        <ProductionMenu handleTownAction={handleTownAction} town={town} />
                    </section>

                    <section className={styles.section}>
                        <h2>Trade<span>{displayGain(town.output.tradeYield)}</span></h2>
                        <TradeReport
                            town={town}
                            townView={true}
                            separateLines={true}
                            inRevolt={town.getIsInRevolt(stateOfPlay.units)} />
                    </section>

                    <section className={styles.section}>
                        <h2>{`Buildings`}</h2>
                        <TownBuildingList town={town} />
                    </section>

                    <section className={styles.section}>
                        <h2>{`${town.supportedUnits.length} units supported`}</h2>
                        <UnitListBox units={town.supportedUnits} />
                    </section>

                    <section className={styles.section}>
                        <h2>{`${town.getUnitsHere(units).length} units here`}</h2>
                        <UnitListBox units={town.getUnitsHere(units)} />
                    </section>
                </div>
            </Window>
        )
    }
}