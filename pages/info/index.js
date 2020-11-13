import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

import { unitTypes } from '../../lib/game-entities/Unit.tsx'

const InfoIndexPage = () => {

    return (
        <Layout>
            <h2>Units</h2>
            <ul>
                {Object.keys(unitTypes).map(unitName => (
                    <li key={`unit-${unitName}`}>
                        <Link
                            href="/info/[unitName]"
                            as={`/info/${unitName}`}
                        >
                            {unitName}
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export default InfoIndexPage
