import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import UnitInfo from '../../../components/info/UnitInfo'

import { unitTypes } from '../../../lib/game-entities/Unit.tsx'

const UnitInfoPage = () => {
    const router = useRouter()
    const { itemName } = router.query
    const unitType = unitTypes[itemName]

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {unitType
                ? <UnitInfo unitType={unitType} />
                : null
            }
        </Layout>
    )
}

export default UnitInfoPage
