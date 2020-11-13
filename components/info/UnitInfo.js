import { spriteSheets } from '../../lib/SpriteSheet.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'

import styles from './info.module.scss'

export default class UnitInfo extends React.Component {
    render() {
        const { unitType } = this.props

        const prerequisite = techDiscoveries[unitType.prerequisite]

        return (
            <article className={styles.article}>
                <h2>{unitType.displayName}</h2>

                <div className={styles.sideBox}>
                    <figure className={styles.figure}>
                        <i className={styles.sprite}
                            style={spriteSheets.units.getStyleForFrameCalled(unitType.spriteFrameName)}></i>
                    </figure>
                    <table>
                        <tbody>
                            <tr><td>attack</td><td>{unitType.attack}</td></tr>
                            <tr><td>defend</td><td>{unitType.defend}</td></tr>
                            <tr><td>moves</td><td>{unitType.moves}</td></tr>
                            <tr><td>cost</td><td>{unitType.productionCost}</td></tr>
                            <tr><td>requires</td><td>{prerequisite ? prerequisite.description : 'none'}</td></tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim semper nibh eu tempor. Suspendisse consequat risus velit, sed ultrices mi facilisis eu. Etiam nec risus quam. Vivamus nec lorem leo. Aliquam id lectus in tellus vehicula aliquet. Donec eleifend nunc maximus, porttitor nisi vitae, bibendum nulla. Nullam turpis est, gravida eget nisl sed, ullamcorper accumsan ex. Curabitur vestibulum massa id quam laoreet pharetra. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu molestie lacus, et sodales neque.
                </p>
                <p>
                    Morbi pharetra, est ut dapibus feugiat, ex libero dignissim mauris, vel cursus justo lacus ut enim. Nullam a posuere nunc. Integer egestas felis eu laoreet consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Vivamus vehicula sagittis lorem, quis ornare orci maximus sit amet. Nullam imperdiet sit amet nisi sagittis faucibus. Morbi rutrum sit amet urna vel placerat. Fusce iaculis, ipsum ac ornare semper, diam nisi tempor turpis, nec pulvinar orci erat sit amet augue. Mauris faucibus bibendum dolor, eu lacinia diam.
                </p>

                <div className={styles.clear}></div>
            </article>
        )
    }

}