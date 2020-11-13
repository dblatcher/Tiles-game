import TileBoard from '../TileBoard'



import { MapSquare } from '../../lib/game-entities/MapSquare.tsx'

import styles from './info.module.scss'

export default class TerrainInfo extends React.Component {

    render() {
        const { terrainType } = this.props

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


                <div className={styles.sideBoxRight}>
                    <table>
                        <tbody>
                            <tr><td>move cost</td><td>{terrainType.movementCost}</td></tr>
                            <tr><td>defense bonus</td><td>{`${terrainType.defenseBonus * 100}%`}</td></tr>
                        </tbody>
                    </table>
                    <TileBoard mapGrid={mapGrid} infoPage />
                </div>
                <h2>{terrainType.name}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim semper nibh eu tempor. Suspendisse consequat risus velit, sed ultrices mi facilisis eu. Etiam nec risus quam. Vivamus nec lorem leo. Aliquam id lectus in tellus vehicula aliquet. Donec eleifend nunc maximus, porttitor nisi vitae, bibendum nulla. Nullam turpis est, gravida eget nisl sed, ullamcorper accumsan ex. Curabitur vestibulum massa id quam laoreet pharetra. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu molestie lacus, et sodales neque.
                </p>


                <div className={styles.clear}></div>
            </article>
        )
    }

}