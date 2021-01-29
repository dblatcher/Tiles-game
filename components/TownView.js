import MapSection from "./MapSection";
import ProductionMenu from "./dialogue/ProductionMenu.tsx";
import Window from "./Window";
import UnitListBox from "./interface/UnitListBox.tsx";
import TradeReport from "./interface/TradeReport.tsx";
import ProgressBox from "./ProgressBox.tsx";
import CitizenRow from "./CitizenRow.tsx";
import TownBuildingList from "./TownBuildingList";

import TabMenu from './interface/TabMenu'
import SvgIcon from './SvgIcon'

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

    get productionCaptionParagraph() {
        const { isProducing } = this.props.stateOfPlay.openTown
        return (
            <p className={styles.caption}>
                Producing:
                <b>{isProducing ? isProducing.displayName : 'nothing'}</b>
            </p>
        )

    }

    get foodStoreCaptionParagraph() {
        const { foodStoreRequiredForGrowth, foodStore, population, populationLimit } = this.props.stateOfPlay.openTown
        const { foodYield } = this.props.stateOfPlay.openTown.output
        let figure, text

        if (foodYield > 0 && population < populationLimit) {
            figure = getTurnsToComplete(foodStoreRequiredForGrowth - foodStore, foodYield)
            text = `growth in ${figure} ${pluralise('turn', figure)}`
        } else if (foodYield < 0) {
            figure = getTurnsToComplete(foodStore, -foodYield)
            text = `starvation in ${figure} ${pluralise('turn', figure)}`
        } else if (population >= populationLimit) {
            text = 'max population'
        } else {
            text = 'no growth'
        }

        return <p className={styles.caption}>{text}</p>
    }

    render() {
        const { closeTownView, handleTownAction, openTownView, stateOfPlay, openFactionWindow, activateUnit } = this.props
        const { mapGrid, towns, units, openTown } = stateOfPlay
        const town = openTown

        const buttonList = [
            { text: town.faction.name, clickFunction: openFactionWindow },
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

        const inRevolt = town.getIsInRevolt(stateOfPlay.units)
        const subTitle = inRevolt
            ? `pop.${town.population},000 - in revolt`
            : `pop.${town.population},000`


        const svgStyle = {
            backgroundColor: 'black',
            height: '2em',
            width: '2em',
            borderRadius: '25%',
            padding: '.1em',
        }

        return (
            <Window title={town.name} subtitle={subTitle} buttons={buttonList}>
                <div className={styles.frame}>

                    <section className={[styles.section, styles.mapSection].join(" ")}>
                        <CitizenRow stateOfPlay={stateOfPlay} town={town} handleCitizenClick={this.handleCitizenClick} />
                        <MapSection
                            handleMapSectionClick={this.handleMapSectionClick}
                            radius={2}
                            town={town} stateOfPlay={stateOfPlay}
                        />
                    </section>

                    <TabMenu mobileOnly tabs={[
                        {
                            label: <SvgIcon style={svgStyle} iconName={'production'} />,
                            content: (
                                <section className={styles.section}>
                                    <h2>Production<span>{displayGain(town.output.productionYield)}</span></h2>
                                    {this.productionCaptionParagraph}
                                    <ProgressBox fullWidth useBlankSymbols showNumbers
                                        current={town.productionStore}
                                        target={town.isProducing ? town.isProducing.productionCost : 0}
                                        showTurnsToComplete turnsToComplete={town.turnsToCompleteProduction}
                                        unit="production" />
                                    <ProductionMenu handleTownAction={handleTownAction} town={town} />
                                </section>
                            )
                        },
                        {
                            label: <SvgIcon style={svgStyle} iconName={'food'} />,
                            content: (
                                <section className={styles.section}>
                                    <h2>Food <span>{displayGain(town.output.foodYield)}</span> </h2>
                                    {this.foodStoreCaptionParagraph}
                                    
                                    <ProgressBox fullWidth showNumbers
                                        current={town.foodStore}
                                        target={town.foodStoreRequiredForGrowth}
                                        unit="food" />
                                </section>
                            )
                        },
                        {
                            label: <SvgIcon style={svgStyle} color={'goldenrod'} iconName={'trade'} />,
                            content: (
                                <section className={styles.section}>
                                    <h2>Trade<span>{displayGain(town.output.tradeYield)}</span></h2>
                                    <TradeReport
                                        town={town}
                                        townView={true}
                                        separateLines={true}
                                        inRevolt={inRevolt} />
                                </section>
                            )
                        },
                        {
                            label: <SvgIcon style={svgStyle} iconName={'building'} />,
                            content: (
                                <section className={styles.section}>
                                    <h2>{`Buildings`}</h2>
                                    <TownBuildingList town={town} />
                                </section>
                            )
                        },
                        {
                            label: <SvgIcon style={svgStyle} iconName={'shieldPerson'} />,
                            content: (
                                <section className={styles.section}>
                                    <h2>{`${town.supportedUnits.length} units supported`}</h2>
                                    <UnitListBox units={town.supportedUnits} onTownView />
                                </section>
                            )
                        },
                        {
                            label: <SvgIcon style={svgStyle} iconName={'shield'} color="white" />,
                            content: (
                                <section className={styles.section}>
                                    <h2>{`${town.getUnitsHere(units).length} units here`}</h2>
                                    <UnitListBox units={town.getUnitsHere(units)} handleClickOnUnit={activateUnit} onTownView />
                                </section>
                            )
                        },
                    ]} />
                </div>
            </Window>
        )
    }
}