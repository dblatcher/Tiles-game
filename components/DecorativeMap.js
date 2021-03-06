import TileBoard from './TileBoard'
import styles from './decorativeMap.module.scss'
import { MapSquare } from '../lib/game-entities/MapSquare';

export default class DecorativeMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapGrid: [[]],
        }
    }

    componentDidMount() {
        const { width = 60, height = 30, treeChance = .35, gridFunction } = this.props
        this.setState({
            mapGrid: gridFunction
                ? gridFunction(width, height, treeChance, 0)
                : MapSquare.makeRandomGrid(width, height, treeChance, 0)
        })
    }

    render() {
        const { mapGrid } = this.state
        const { scale = 1, fixed = false } = this.props

        const asideClassList = [styles.container]
        if (fixed) {
            asideClassList.push(styles.fixed)
        }

        return <aside className={asideClassList.join(" ")}>
            <TileBoard mapGrid={mapGrid} decorative mapZoomLevel={scale} />
        </aside>
    }

}