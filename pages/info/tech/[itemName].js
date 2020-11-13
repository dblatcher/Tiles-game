import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
// import UnitInfo from '../../../components/info/UnitInfo'

import { techDiscoveries } from '../../../lib/game-entities/TechDiscovery.tsx'

const TechInfoPage = () => {
    const router = useRouter()
    const { itemName } = router.query
    const techDiscovery = techDiscoveries[itemName]

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {techDiscovery
                ? <h2>tech: {techDiscovery.description} </h2>
                : null
            }
        </Layout>
    )
}

export default TechInfoPage
