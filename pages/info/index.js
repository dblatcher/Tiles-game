import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

import { unitTypes } from '../../lib/game-entities/Unit.tsx'
import { terrainTypes } from '../../lib/game-entities/TerrainType.tsx'

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

            <h2>Terrains</h2>
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
        </Layout>
    )
}

export default InfoIndexPage
