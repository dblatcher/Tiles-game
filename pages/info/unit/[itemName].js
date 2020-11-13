import path from 'path'
import fs from 'fs'

import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'


import UnitInfo from '../../../components/info/UnitInfo'

import { unitTypes } from '../../../lib/game-entities/Unit.tsx'

const UnitInfoPage = ({content}) => {
    const router = useRouter()
    const { itemName } = router.query
    const unitType = unitTypes[itemName]

    return (
        <Layout backLinkText="Back to Index" backLinkUrl="/info">
            {unitType
                ? <UnitInfo unitType={unitType} content={content} />
                : null
            }
        </Layout>
    )
}

export default UnitInfoPage

export async function getStaticProps(context) {

    let content = {}, filenames = []
    const filename = context.params.itemName + '.json'
    const contentDirectory = path.join(process.cwd(), 'content/unit')

    try {
        filenames = fs.readdirSync(contentDirectory)
    } catch(error) {
        console.warn (error)
    } 

    if (filenames.includes(filename)) {
        const filePath = path.join(contentDirectory, filename)
        content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }


    return {
        props: {content}, // will be passed to the page component as props
    }
}

export async function getStaticPaths() {
    return {
        paths: [
        ],
        fallback: true // See the "fallback" section below
    };
}