import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
// import UnitInfo from '../../../components/info/UnitInfo'

import { buildingTypes } from '../../../lib/game-entities/BuildingType.tsx'

const BuildingInfoPage = () => {
    const router = useRouter()
    const { itemName } = router.query
    const buildingType = buildingTypes[itemName]

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {buildingType
                ? <h2>building: {buildingType.displayName} </h2>
                : null
            }
        </Layout>
    )
}

export default BuildingInfoPage
