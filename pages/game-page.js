import React from 'react'
import Layout from '../components/Layout'
import TileBoard from '../components/TileBoard'



export default class GamePage extends React.Component {

    render() {
        return (
            <Layout>
                <TileBoard rows={5} columns={5}/>
            </Layout>
        )
    }
}