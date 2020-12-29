import React from 'react'
import dialogueStyles from '../dialogue.module.scss'
import makeGameStateFunction from '../../lib/makeGameState'


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
                        }
                    ))
                }}>new game</button>

                <button className={dialogueStyles.button} onClick={() => {
                    newGame(makeGameStateFunction.test())
                }}>test world</button>
            </section>
        )
    }

}