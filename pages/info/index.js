import React from 'react'
import Layout from '../../components/Layout'

import { unitTypes } from '../../lib/game-entities/UnitType'
import { terrainTypes } from '../../lib/game-entities/TerrainType'
import { buildingTypes } from '../../lib/game-entities/BuildingType'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery'
import IndexList from '../../components/info/IndexList'


const InfoIndexPage = () => {

    return (
        <Layout>
            <IndexList title="Units" listObject = {unitTypes} />
            <IndexList title="Buildings" listObject = {buildingTypes} />
            <IndexList title="Terrain" listObject = {terrainTypes} />
            <IndexList title="Discoveries" listObject = {techDiscoveries} />
        </Layout>
    )
}

export default InfoIndexPage
