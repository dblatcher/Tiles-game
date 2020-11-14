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




const folderNameMap = {
    unit: {
        target: unitTypes,
        component: UnitInfo,
    },
    terrain: {
        target: terrainTypes,
        component: TerrainInfo,
    },
    building: {
        target: buildingTypes,
        component: BuildingInfo,
    },
    tech: {
        target: techDiscoveries,
        component: TechInfo,
    },
}

const NotFound = ({ params, badType }) => {
    if (badType) {
        return (<p>There is no such thing as a "{params.type}"!</p>)
    }
    return (<p>There is no {params.type} called "{params.itemName}"!</p>)
}

const InfoPage = ({ content, params }) => {
    let subject = null;
    let pageContent = null;

    // params are loaded asynchronously - will be null at first
    if (params) {
        if (params.type && folderNameMap[params.type]) {
            subject = findValueWithLowerCasedKey(folderNameMap[params.type].target, params.itemName)
            const InfoComponentType = folderNameMap[params.type].component

            if (subject) {
                pageContent = <InfoComponentType subject={subject} content={content} />
            } else {
                pageContent = <NotFound params={params} />
            }
        } else {
            pageContent = <NotFound params={params} badType />
        }
    }


    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {pageContent || "loading..."}
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
        type: slug[0] || null,
        itemName: slug[1] || null
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