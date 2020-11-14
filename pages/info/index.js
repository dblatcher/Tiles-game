import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

import { unitTypes } from '../../lib/game-entities/Unit.tsx'
import { terrainTypes } from '../../lib/game-entities/TerrainType.tsx'
import { buildingTypes } from '../../lib/game-entities/BuildingType.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'

const InfoIndexPage = () => {

    return (
        <Layout>
            <h2>Units</h2>
            <ul>
                {Object.keys(unitTypes).map(typeName => (
                    <li key={`unit-${typeName}`}>
                        <Link
                            href="/info/unit/[typeName]"
                            as={`/info/unit/${typeName}`}
                        >
                            {unitTypes[typeName].name}
                        </Link>
                    </li>
                ))}
            </ul>

            <h2>Buildings</h2>
            <ul>
                {Object.keys(buildingTypes).map(typeName => (
                    <li key={`building-${typeName}`}>
                        <Link
                            href="/info/building/[typeName]"
                            as={`/info/building/${typeName}`}
                        >
                            {buildingTypes[typeName].name}
                        </Link>
                    </li>
                ))}
            </ul>

            <h2>Terrain</h2>
            <ul>
                {Object.keys(terrainTypes).map(typeName => (
                    <li key={`terrain-${typeName}`}>
                        <Link
                            href="/info/terrain/[typeName]"
                            as={`/info/terrain/${typeName}`}
                        >
                            {terrainTypes[typeName].name}
                        </Link>
                    </li>
                ))}
            </ul>

            <h2>Discoveries</h2>
            <ul>
                {Object.keys(techDiscoveries).map(typeName => (
                    <li key={`tech-${typeName}`}>
                        <Link
                            href="/info/tech/[typeName]"
                            as={`/info/tech/${typeName}`}
                        >
                            {techDiscoveries[typeName].description}
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export default InfoIndexPage
