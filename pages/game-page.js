import React from 'react'
import Layout from '../components/Layout'
import GameContainer from '../components/GameContainer'
import makeGameState from '../lib/makeGameState' 

export default class GamePage extends React.Component {

    render() {
        return (
            <Layout gamePage>
                <GameContainer startingGameState={makeGameState.test()}/>
            </Layout>
        )
    }
}