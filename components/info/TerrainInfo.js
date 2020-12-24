import TileBoard from '../TileBoard'
import { MapSquare } from '../../lib/game-entities/MapSquare'
import styles from './info.module.scss'

export default class TerrainInfo extends React.Component {

    render() {
        const { subject, content } = this.props
        const terrainType = subject

        const mapGrid = MapSquare.makeGrid(3, 3, function (x, y) {
            let mapSquare = new MapSquare({
                terrain: terrainType,
                tree: x == 0 && y == 0,
                irrigation: x >= 1 && y == 0,
                mine: x == 0 && y == 1,
                road: x == 2,
            }, x, y)

            return mapSquare
        })


        return (
            <article className={styles.article}>
                <h3>{terrainType.name}</h3>

                <div className={styles.sideBoxRight}>

                    <TileBoard mapGrid={mapGrid} infoPage />
                </div>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{terrainType.name} is a type of terrain.</p>}

                <table>
                    <tbody>
                        <tr><td>move cost</td><td>{terrainType.movementCost}</td></tr>
                        <tr><td>defense bonus</td><td>{`${terrainType.defenseBonus * 100}%`}</td></tr>
                    </tbody>
                </table>

                <div className={styles.clear}></div>
            </article>
        )
    }

}