import React from 'react'
import dialogueStyles from '../../styles/dialogue.module.scss'
import makeGameStateFunction from '../../lib/game-creation/makeGameState'
import { landFormOptions } from '../../lib/game-maps/MapConfig'


export default class NewGameOptions extends React.Component {
    props: {
        newGame: Function,
        children: React.ReactChildren
    }

    render() {
        const { newGame, children } = this.props

        return (
            <section className={dialogueStyles.buttonRow}>

                {children}

                <button className={dialogueStyles.button} onClick={() => {
                    newGame(makeGameStateFunction.randomWorld(
                        {
                            width: 50,
                            height: 20,
                            treeChance: .3,
                        },
                        {
                            tutorialEnabled: false,
                            numberOfFactions: 4,
                        }
                    ))
                }}>new game</button>

                <button className={dialogueStyles.button} onClick={() => {
                    newGame(makeGameStateFunction.randomWorld(
                        {
                            width: 40,
                            height: 15,
                            treeChance: .3,
                            landFormOption: landFormOptions[1]
                        }, 
                        {
                            tutorialEnabled: true,
                            numberOfFactions: 1,
                        }
                    ))
                }}>tutorial</button>

            </section>
        )
    }

}