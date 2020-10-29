import { unitTypes } from '../lib/Unit.tsx'
import { spriteSheets } from '../lib/SpriteSheet.tsx'
import { getTurnsToComplete } from '../lib/utility'
import styles from './productionMenu.module.scss'
import dialogueStyles from './dialogue.module.scss'

export default class ProductionMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            listIsOpen: false
        }

        this.openList = this.openList.bind(this)
        this.closeList = this.closeList.bind(this)
        this.handleProductionItemPick = this.handleProductionItemPick.bind(this)
    }

    openList() { return this.setState({ listIsOpen: true }) }
    closeList() { return this.setState({ listIsOpen: false }) }

    renderUnitTypeOptions() {
        const { town } = this.props
        return Object.keys(unitTypes)
            .map(key => unitTypes[key])
            .map(unitType => {

                const remainingProduction = unitType.productionCost - town.productionStore
                let turnsToComplete = getTurnsToComplete(remainingProduction, town.output.productionYield)

                return (
                    <li key={`unitOption-${unitType.name}`}
                        className={styles.productionItem}
                        onClick={() => { this.handleProductionItemPick(unitType) }}>
                        <figure className={styles.figure}>
                            <i className={styles.sprite}
                                style={spriteSheets.units.getStyleForFrameCalled(unitType.spriteFrameName)}></i>
                        </figure>

                        <span>{`${unitType.name}(${unitType.productionCost})`}</span>
                        <span>{`${turnsToComplete} turn${turnsToComplete == 1 ? '' : 's'}`}</span>
                    </li>
                )
            })
    }

    handleProductionItemPick(item) {
        const { handleTownAction, town } = this.props
        this.setState({ listIsOpen: false })
        return handleTownAction("PRODUCTION_PICK", { town, item })
    }

    render() {
        const { town } = this.props
        const { listIsOpen } = this.state

        return (<>
            <section>
                <button className={styles.changeButton} onClick={this.openList}>change</button>
                <span>{`Producing ${town.isProducing ? town.isProducing.name : 'nothing'}`}</span>
            </section>

            {listIsOpen ?
                <aside className={dialogueStyles.dialogueHolder}>

                    <nav className={dialogueStyles.dialogueFrame}>
                        <ul className={styles.productionItemList}>
                            {this.renderUnitTypeOptions()}
                        </ul>

                        <div className={dialogueStyles.buttonRow}>
                            <button className={dialogueStyles.button} onClick={this.closeList}>close</button>
                        </div>
                    </nav>
                </aside>
                : null}
        </>)
    }
}