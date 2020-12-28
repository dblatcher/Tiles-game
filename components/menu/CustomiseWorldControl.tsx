import React from 'react'
import dialogueStyles from '../dialogue.module.scss'

import makeGameStateFunction from '../../lib/makeGameState'
import { MapConfig } from '../../lib/game-maps/MapConfig'

export default class CustomiseWorldControl extends React.Component {
    props: {
        newGame: Function,
        children: React.ReactChildren
    }
    state: MapConfig

    constructor(props: { noActiveGame: boolean }) {
        super(props)

        this.state = {
            width: 40,
            height: 20,
            treeChance: .3,
        }

        this.setRangeValue = this.setRangeValue.bind(this)
    }

    setRangeValue(property, inputElement) {
        console.log({ property, inputElement })
        console.log(inputElement.value)
        let modification = {}
        modification[property] = inputElement.value
        this.setState(modification)
    }

    render() {
        const { children, newGame } = this.props
        const { width, height, treeChance } = this.state

        return <section>
            <h3>Customise World</h3>

            <table>
                <tbody>
                    <tr>
                        <td><label>Width</label></td>
                        <td>
                            <input type="range" min="20" max="100" value={width}
                                onChange={(event) => { this.setRangeValue('width', event.target) }} />
                        </td>
                        <td><span>{width}</span></td>
                    </tr>
                    <tr>
                        <td><label>Height</label></td>
                        <td>
                            <input type="range" min="15" max="50" value={height}
                                onChange={(event) => { this.setRangeValue('height', event.target) }} />
                        </td>
                        <td><span>{height}</span></td>
                    </tr>
                    <tr>
                        <td><label>forestation</label></td>
                        <td>
                            <input type="range" min="0" max="1" step=".05" value={treeChance}
                                onChange={(event) => { this.setRangeValue('treeChance', event.target) }} />
                        </td>
                        <td><span>{(treeChance*100).toFixed(0)}%</span></td>
                    </tr>
                </tbody>
            </table>

            <button className={dialogueStyles.button} onClick={() => {
                newGame(makeGameStateFunction.randomWorld(this.state))
            }}>new game</button>

            {children}
        </section>
    }
}
