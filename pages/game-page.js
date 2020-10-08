import React from 'react'
import Layout from '../components/Layout'
import GameContainer from '../components/GameContainer'



export default class GamePage extends React.Component {

    render() {
        return (
            <Layout>
                <GameContainer/>
            </Layout>
        )
    }
}