
import styles from './info.module.scss'

import { unitTypes } from '../../lib/game-entities/UnitType.ts'
import { buildingTypes } from '../../lib/game-entities/BuildingType'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery'
import InfoLink from '../InfoLink'
import TechTree from '../TechTree'

export default class TechInfo extends React.Component {

    render() {
        const { subject, content } = this.props
        const techDiscovery = subject
        if (!techDiscovery) { return null }

        const unitTypesEnabled = [], buildingTypesEnabled = [], techDiscoveriesEnabled = [];

        Object.keys(unitTypes)
            .map(key => unitTypes[key])
            .forEach(unitType => {
                if (unitType.prerequisite === techDiscovery.name) [
                    unitTypesEnabled.push(unitType)
                ]
            })

        Object.keys(buildingTypes)
            .map(key => buildingTypes[key])
            .forEach(buildingType => {
                if (buildingType.prerequisite === techDiscovery.name) [
                    buildingTypesEnabled.push(buildingType)
                ]
            })

        Object.keys(techDiscoveries)
            .map(key => techDiscoveries[key])
            .forEach(otherTechDiscovery => {
                if (otherTechDiscovery.prerequisites.includes(techDiscovery.name)) [
                    techDiscoveriesEnabled.push(otherTechDiscovery)
                ]
            })

        const allowsList = unitTypesEnabled.length + buildingTypesEnabled.length + techDiscoveriesEnabled.length > 0

        return (
            <article className={styles.article}>
                <h3>{techDiscovery.description}</h3>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{techDiscovery.description} is a techDiscovery.</p>}

                <div className={styles.clear}></div>

                {techDiscovery.prerequisites.length > 0 && <div className={styles.float}>
                    <h4>Requires</h4>
                    <ul>
                    {techDiscovery.prerequisites.map(prerequisiteName => (
                        <li key={`prerequisites-list-${prerequisiteName}`}>
                            <InfoLink subject={techDiscoveries[prerequisiteName]} sameWindow useDescription/> 
                        </li>
                    ))}
                    </ul>
                </div>}

                {allowsList && <div className={styles.float}>
                    <h4>Allows</h4>
                    <ul>
                        {unitTypesEnabled.map(unitType => (
                            <li key={`unit-list-${unitType.name}`}>
                                <InfoLink subject={unitType} sameWindow useDescription/> 
                            </li>
                        ))}
                        {buildingTypesEnabled.map(buildingType => (
                            <li key={`building-list-${buildingType.name}`}>
                                <InfoLink subject={buildingType} sameWindow useDescription/> 
                            </li>
                        ))}
                        {techDiscoveriesEnabled.map(techDiscovery => (
                            <li key={`tech-list-${techDiscovery.name}`}>
                                <InfoLink subject={techDiscovery} sameWindow useDescription/> 
                            </li>
                        ))}
                    </ul>
                </div>}

                <div className={styles.clear}></div>

                <TechTree focus={techDiscovery}/>
            </article>
        )
    }

}