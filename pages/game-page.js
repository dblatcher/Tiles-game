import React from 'react'
import Layout from '../components/Layout'
import GameContainer from '../components/GameContainer'
import makeGameStateFunction from '../lib/game-creation/makeGameState' 

export default class GamePage extends React.Component {

    render() {
        return (
            <Layout gamePage>
                <GameContainer 
                startingGameStateFunction={makeGameStateFunction.blank()}
            />
            </Layout>
        )
    }
}