import path from 'path'
import fs from 'fs'

import React from 'react'
import Layout from '../../components/Layout'

import UnitInfo from '../../components/info/UnitInfo'
import TerrainInfo from '../../components/info/TerrainInfo'
import BuildingInfo from '../../components/info/BuildingInfo'
import TechInfo from '../../components/info/TechInfo'

import { unitTypes } from '../../lib/game-entities/Unit.tsx'
import { terrainTypes } from '../../lib/game-entities/TerrainType.tsx'
import { buildingTypes } from '../../lib/game-entities/BuildingType.tsx'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'

import { findValueWithLowerCasedKey } from '../../lib/utility'


const InfoPage = ({ content, params }) => {
    let subject = null, infoComponent = null

    if (params && params.type == 'unit') {
        subject = findValueWithLowerCasedKey(unitTypes, params.itemName)
        infoComponent = <UnitInfo unitType={subject} content={content} />
    }
    if (params && params.type == 'terrain') {
        subject = findValueWithLowerCasedKey(terrainTypes, params.itemName)
        infoComponent = <TerrainInfo terrainType={subject} content={content} />
    }
    if (params && params.type == 'building') {
        subject = findValueWithLowerCasedKey(buildingTypes, params.itemName)
        infoComponent = <BuildingInfo buildingType={subject} content={content} />
    }
    if (params && params.type == 'tech') {
        subject = findValueWithLowerCasedKey(techDiscoveries, params.itemName)
        infoComponent = <TechInfo techDiscovery={subject} content={content} />
    }

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {infoComponent}
        </Layout>
    )
}
export default InfoPage


function getContentJson(params) {
    let content = {}
    if (params.type && params.itemName) {
        try {
            const filename = params.itemName + '.json'
            const contentDirectory = path.join(process.cwd(), `content`)

            if (fs.readdirSync(contentDirectory).includes(params.type)) {
                const subfolder = path.join(contentDirectory, params.type)
                const filenames = fs.readdirSync(subfolder)
                if (filenames.includes(filename)) {
                    const filePath = path.join(subfolder, filename)
                    content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
                }
            }

        } catch (error) {
            console.warn(error.toString())
        }
    }

    return content
}

export async function getStaticProps(context) {

    const { slug } = context.params

    const params = {
        type: slug[0],
        itemName: slug[1]
    }

    const content = await getContentJson(params)

    return {
        props: { content, params }, // will be passed to the page component as props
    }
}

export async function getStaticPaths() {
    return {
        paths: [
        ],
        fallback: true // See the "fallback" section below
    };
}