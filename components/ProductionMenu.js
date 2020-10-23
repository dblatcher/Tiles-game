import { unitTypes } from '../lib/Unit.tsx'
import styles from './productionMenu.module.scss'

export default class ProductionMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            listIsOpen: false
        }

        this.openList = this.openList.bind(this)
        this.closeList = this.closeList.bind(this)
    }

    openList() { return this.setState({ listIsOpen: true }) }
    closeList() { return this.setState({ listIsOpen: false }) }

    render() {
        const { handleTownAction, town } = this.props
        const { listIsOpen } = this.state



        return (<>
            <section>
                <p>
                    <span>Production: {town.productionStore} {`(+${town.output.productionYield}) - `}</span>
                    <span>producing: </span>
                    <span>{town.isProducing ? town.isProducing.name : 'Nothing'}</span>
                    <button onClick={this.openList}>change</button>
                </p>
            </section>

            {listIsOpen ?
                <aside className={styles.menuHolder}>

                    <nav className={styles.menu}>
                        <button onClick={this.closeList}>close</button>
                        <h2>menu</h2>
                    </nav>
                </aside>
                : null}
        </>)
    }
}