import TileBoard from './TileBoard'
import makeGameState from '../lib/makeGameState'
import styles from './decorativeMap.module.css'

export default class DecorativeMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapGrid: [[]],
        }
    }

    componentDidMount() {
        this.setState({ mapGrid: makeGameState.randomWorld().mapGrid })
    }

    render() {
        const { mapGrid } = this.state
        const { scale = 1 } = this.props
        return <aside className={styles.container}>
            <TileBoard mapGrid={mapGrid} decorative mapZoomLevel={scale} />
        </aside>
    }

}