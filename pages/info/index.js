import React from 'react'
import Layout from '../../components/Layout'

import { unitTypes } from '../../lib/game-entities/Unit.tsx'
import { terrainTypes } from '../../lib/game-entities/TerrainType.tsx'
import { buildingTypes } from '../../lib/game-entities/BuildingType.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'
import InfoLink from '../../components/InfoLink'

const InfoIndexPage = () => {

    return (
        <Layout>
            <h2>Units</h2>
            <ul>
                {Object.keys(unitTypes).map(typeName => (
                    <li key={`unit-${typeName.toLowerCase()}`}>
                        <InfoLink subject={unitTypes[typeName]} useDescription sameWindow/>
                    </li>
                ))}
            </ul>

            <h2>Buildings</h2>
            <ul>
                {Object.keys(buildingTypes).map(typeName => (
                    <li key={`building-${typeName.toLowerCase()}`}>
                        <InfoLink subject={buildingTypes[typeName]} useDescription sameWindow/>
                    </li>
                ))}
            </ul>

            <h2>Terrain</h2>
            <ul>
                {Object.keys(terrainTypes).map(typeName => (
                    <li key={`terrain-${typeName.toLowerCase()}`}>
                        <InfoLink subject={terrainTypes[typeName]} useDescription sameWindow/>
                    </li>
                ))}
            </ul>

            <h2>Discoveries</h2>
            <ul>
                {Object.keys(techDiscoveries).map(typeName => (
                    <li key={`tech-${typeName.toLowerCase()}`}>
                        <InfoLink subject={techDiscoveries[typeName]} useDescription sameWindow/>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export default InfoIndexPage
