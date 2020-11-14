import TileBoard from '../TileBoard'
import { MapSquare } from '../../lib/game-entities/MapSquare.tsx'
import styles from './info.module.scss'

export default class TerrainInfo extends React.Component {

    render() {
        const { terrainType, content } = this.props

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


                <div className={styles.sideBox}>
                    <table>
                        <tbody>
                            <tr><td>move cost</td><td>{terrainType.movementCost}</td></tr>
                            <tr><td>defense bonus</td><td>{`${terrainType.defenseBonus * 100}%`}</td></tr>
                        </tbody>
                    </table>
                    <TileBoard mapGrid={mapGrid} infoPage />
                </div>
                <h2>{terrainType.name}</h2>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{terrainType.name} is a type of terrain.</p>}


                <div className={styles.clear}></div>
            </article>
        )
    }

}