
import styles from './info.module.scss'

import { unitTypes } from '../../lib/game-entities/UnitType.ts'
import { buildingTypes } from '../../lib/game-entities/BuildingType.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'
import InfoLink from '../InfoLink'
import TechTree from '../TechTree'

export default class TechInfo extends React.Component {

    render() {
        const { subject, content } = this.props
        const techDiscovery = subject
        if (!techDiscovery) { return null }

        const unitTypesEnabled = [], buildingTypesEnabled = []

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


        return (
            <article className={styles.article}>
                <h3>{techDiscovery.description}</h3>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{techDiscovery.description} is a techDiscovery.</p>}


                {unitTypesEnabled.length + buildingTypesEnabled.length >0 
                ? (<>
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
                    </ul>
                </>)
                : (null)}

                {techDiscovery.prerequisites.length > 0 && (
                    <>
                    <h4>Requires</h4>
                    <ul>
                    {techDiscovery.prerequisites.map(prerequisiteName => (
                        <li key={`prerequisites-list-${prerequisiteName}`}>
                            <InfoLink subject={techDiscoveries[prerequisiteName]} sameWindow useDescription/> 
                        </li>
                    ))}
                    </ul>
                    </>
                )}

                <div className={styles.clear}></div>

                <TechTree focus={techDiscovery}/>
            </article>
        )
    }

}