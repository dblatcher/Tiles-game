import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import TerrainInfo from '../../../components/info/TerrainInfo'

import { terrainTypes } from '../../../lib/game-entities/TerrainType.tsx'

const TerrainInfoPage = () => {
    const router = useRouter()
    const { terrainName } = router.query
    const terrainType = terrainTypes[terrainName]

    console.log('TerrainInfoPage!')

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {terrainType
                ? <TerrainInfo terrainType={terrainType} />
                : null
            }
        </Layout>
    )
}

export default TerrainInfoPage
