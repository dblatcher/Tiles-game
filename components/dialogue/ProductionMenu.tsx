import React from 'react';

import { unitTypes } from '../../lib/game-entities/UnitType'
import { buildingTypes } from '../../lib/game-entities/BuildingType'
import styles from './productionMenu.module.scss'
import dialogueStyles from '../../styles/dialogue.module.scss'
import SvgIcon from '../SvgIcon'
import InfoLink from '../InfoLink'
import { displayTurnsToComplete } from '../../lib/utility'
import { Town } from '../../lib/game-entities/Town';
import ProgressBar from '../interface/ProgressBar';

class ProductionMenuProps {
    town: Town
    handleTownAction: Function
    showProgressBar: boolean
}

export default class ProductionMenu extends React.Component {
    props:ProductionMenuProps
    state: {
        listIsOpen: boolean,
        hurryDialogueIsOpen: boolean,
    }
    constructor(props:ProductionMenuProps) {
        super(props)

        this.state = {
            listIsOpen: false,
            hurryDialogueIsOpen: false,
        }

        this.openList = this.openList.bind(this)
        this.closeList = this.closeList.bind(this)
        this.openHurryButtonIfAllowed = this.openHurryButtonIfAllowed.bind(this)
        this.handleProductionItemPick = this.handleProductionItemPick.bind(this)
        this.hurryProduction = this.hurryProduction.bind(this)
    }

    openList() { return this.setState({ listIsOpen: true }) }
    closeList() { return this.setState({ listIsOpen: false }) }

    openHurryButtonIfAllowed() {
        const { town } = this.props
        if (town.canHurryProduction) {
            return this.setState({ hurryDialogueIsOpen: true })
        }
    }

    renderUnitTypeOptions() {
        const { town } = this.props

        return Object.keys(unitTypes)
            .map(key => unitTypes[key])
            .filter(unitType => unitType.checkCanBuildWith(town.faction.knownTech))
            .map(unitType => {
                const turnsToComplete = town.getTurnsToComplete(unitType)
                return (
                    <li key={`unitOption-${unitType.name}`}
                        className={styles.productionItem}
                        onClick={() => { this.handleProductionItemPick(unitType) }}>
                        <figure className={styles.figure}>
                            <i className={styles.sprite}
                                style={unitType.spriteStyle}></i>
                        </figure>

                        <div className={styles.productionItemText}>
                            <p className={styles.unitStatSet}>
                                <span>{unitType.displayName}</span>
                                <span>{displayTurnsToComplete(turnsToComplete)}</span>
                            </p>
                            <p className={styles.unitStatSet}>
                                <span className={[styles.unitStat, styles.production].join(" ")}>
                                    <SvgIcon iconName="production" />
                                    {unitType.productionCost}
                                </span>
                                <span className={styles.unitStat}>
                                    <SvgIcon iconName="fistRaised" />
                                    {unitType.attack}
                                </span>
                                <span className={styles.unitStat}>
                                    <SvgIcon iconName="shield" color="black" />
                                    {unitType.defend}
                                </span>
                                <span className={styles.unitStat}>
                                    <SvgIcon iconName="shoePrints" />
                                    {unitType.moves}
                                </span>
                            </p>
                        </div>

                        <InfoLink subject={unitType} />
                    </li>
                )
            })
    }

    renderBuildingTypeOptions() {
        const { town } = this.props

        return Object.keys(buildingTypes)
            .map(key => buildingTypes[key])
            .filter(buildingType => !town.buildings.includes(buildingType))
            .filter(buildingType => buildingType.checkCanBuildWith(town.faction.knownTech))
            .map(buildingType => {
                const turnsToComplete = town.getTurnsToComplete(buildingType)
                return (
                    <li key={`buildingOption-${buildingType.name}`}
                        className={styles.productionItem}
                        onClick={() => { this.handleProductionItemPick(buildingType) }}>

                        <div className={styles.productionItemText}>
                            <p className={styles.unitStatSet}>
                                <span>{buildingType.displayName}</span>
                                <span>{displayTurnsToComplete(turnsToComplete)}</span>
                            </p>
                            <p className={styles.unitStatSet}>
                            <span className={[styles.unitStat, styles.production].join(" ")}>
                                    <SvgIcon iconName="production" />
                                    {buildingType.productionCost}
                                </span>
                            </p>
                        </div>
                        <InfoLink subject={buildingType} />
                    </li>
                )
            })
    }

    handleProductionItemPick(item) {
        const { handleTownAction, town } = this.props
        this.setState({ listIsOpen: false })
        return handleTownAction("PRODUCTION_PICK", { town, item })
    }

    hurryProduction() {
        const { handleTownAction, town } = this.props
        this.setState({ hurryDialogueIsOpen: false })
        return handleTownAction("HURRY_PRODUCTION", { town })
    }

    render() {
        const { town } = this.props
        const { listIsOpen, hurryDialogueIsOpen } = this.state

        const hurryButtonStyles = [styles.button]
        if (!town.canHurryProduction) {
            hurryButtonStyles.push(styles.buttonDisabled)
        }


        return (<>
            <article className={styles.productionMenu}>

                {(this.props.showProgressBar) && 
                    <ProgressBar subject={town} topic={'PRODUCTION'} showAmount showTurnsToComplete ={!!town.isProducing}/>
                }

                <div className={styles.buttonHolder}>
                    <button className={styles.button} onClick={this.openList}>change</button>

                    <button className={hurryButtonStyles.join(" ")}
                        onClick={this.openHurryButtonIfAllowed}>
                        <span>Hurry</span>
                        {town.costToHurryProduction !== false ? (
                            <span style={{ display: 'inline-flex' }}>&nbsp;({town.costToHurryProduction} <SvgIcon iconName="coins" />)</span>
                        )
                            : null}
                    </button>
                </div>
            </article>

            {listIsOpen ?
                <aside className={dialogueStyles.dialogueHolder}>

                    <nav className={[dialogueStyles.dialogueFrame, styles.productionDialogueFrame].join(" ")}>
                        <ul className={styles.productionItemList}>
                            {this.renderUnitTypeOptions()}
                            {this.renderBuildingTypeOptions()}
                        </ul>

                        <div className={dialogueStyles.buttonRow}>
                            <button className={dialogueStyles.button} onClick={this.closeList}>close</button>
                        </div>
                    </nav>
                </aside>
                : null}

            {hurryDialogueIsOpen ?
                <aside className={dialogueStyles.dialogueHolder}>

                    <nav className={dialogueStyles.dialogueFrame}>
                        <p>
                            Spend {town.costToHurryProduction}<SvgIcon iconName='coins' />&nbsp;
                            of {town.faction.treasury}<SvgIcon iconName='coins' />&nbsp;
                            to hurry production of {town.productionItemName}?
                        </p>

                        <div className={dialogueStyles.buttonRow}>
                            <button
                                className={dialogueStyles.button}
                                onClick={
                                    () => { this.setState({ hurryDialogueIsOpen: false }) }
                                }
                            >cancel</button>
                            <button
                                className={dialogueStyles.button}
                                onClick={this.hurryProduction}
                            >confirm</button>
                        </div>
                    </nav>
                </aside>
                : null}
        </>)
    }
}