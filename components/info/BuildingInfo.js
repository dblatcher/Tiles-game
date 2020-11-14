import InfoLink from '../InfoLink'

import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'
import styles from './info.module.scss'

export default class BuildingInfo extends React.Component {

    render() {
        const { subject, content } = this.props

        if (!subject) { return null }
        const buildingType = subject
        const prerequisite = techDiscoveries[buildingType.prerequisite]

        return (
            <article className={styles.article}>

                <h2>{buildingType.name}</h2>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{buildingType.name} is a type of building.</p>}


                <table>
                    <tbody>
                        <tr><td>requires</td><td>{prerequisite
                            ? <InfoLink sameWindow useDescription subject={prerequisite} />
                            : 'none'}</td></tr>
                    </tbody>
                </table>

                <div className={styles.clear}></div>
            </article>
        )
    }

}