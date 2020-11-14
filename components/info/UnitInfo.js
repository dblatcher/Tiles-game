import InfoLink from '../InfoLink'

import { spriteSheets } from '../../lib/SpriteSheet.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'

import styles from './info.module.scss'

export default class UnitInfo extends React.Component {
    render() {
        const { subject, content } = this.props
        const unitType = subject

        const prerequisite = techDiscoveries[unitType.prerequisite]

        return (
            <article className={styles.article}>

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
                            <tr><td>requires</td><td>{prerequisite 
                            ?  <InfoLink sameWindow useDescription subject={prerequisite}/>
                            : 'none'}</td></tr>
                        </tbody>
                    </table>
                </div>

                <h2>{unitType.displayName}</h2>
                <p>
                    {content ? content.description : ""}
                </p>
                <div className={styles.clear}></div>
            </article>
        )
    }

}