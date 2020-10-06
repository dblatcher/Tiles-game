import React from 'react'
import Layout from '../components/Layout'
import CanvasTileBoard from '../components/CanvasTileBoard'



export default class GamePage extends React.Component {

    render() {
        return (
            <Layout>
                <CanvasTileBoard rows={10} columns={10} tileWidth={40} tileHeight={40}/>
            </Layout>
        )
    }
}