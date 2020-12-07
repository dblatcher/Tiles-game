import TileBoard from './TileBoard'
import styles from './decorativeMap.module.css'
import { MapSquare } from '../lib/game-entities/MapSquare.tsx';

export default class DecorativeMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapGrid: [[]],
        }
    }

    componentDidMount() {
        const { width = 20, height = 20, treeChance = .25 } = this.props
        this.setState({
            mapGrid: MapSquare.makeRandomGrid(width, height, treeChance, 0)
        })
    }

    render() {
        const { mapGrid } = this.state
        const { scale = 1 } = this.props
        return <aside className={styles.container}>
            <TileBoard mapGrid={mapGrid} decorative mapZoomLevel={scale} />
        </aside>
    }

}