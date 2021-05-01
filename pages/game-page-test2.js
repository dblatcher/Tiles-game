import React from 'react'
import Layout from '../components/Layout'
import GameContainer from '../components/GameContainer.tsx'
import makeGameStateFunction from '../lib/game-creation/makeGameState' 

export default class GamePage extends React.Component {

    render() {
        return (
            <Layout gamePage>
                <GameContainer 
                startingGameStateFunction={makeGameStateFunction.test2()}
                debugMode={true}
            />
            </Layout>
        )
    }
}