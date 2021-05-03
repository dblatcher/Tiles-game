import React from 'react'
import dialogueStyles from '../../styles/dialogue.module.scss'

import makeGameStateFunction from '../../lib/game-creation/makeGameState'
import { MapConfig, landFormOptions, LandFormOption } from '../../lib/game-maps/MapConfig'

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
            villageRate: .1,
            landFormOption: landFormOptions[0]
        }

        this.setRangeValue = this.setRangeValue.bind(this)
        this.setSelectValue = this.setSelectValue.bind(this)
    }

    setRangeValue(property, inputElement) {
        let modification = {}
        modification[property] = Number(inputElement.value)
        this.setState(modification)
    }

    setSelectValue(property, inputElement) {
        let modification = {}

        if (property === 'landFormOption') {
            modification[property] = LandFormOption.map[inputElement.value]
        }

        this.setState(modification)
    }

    get villageRateDescription() {
        if (this.state.villageRate <= 0) { return "none" }
        if (this.state.villageRate <= 0.1) { return "a few" }
        if (this.state.villageRate <= 0.2) { return "quite a few" }
        return "lots"
    }

    renderRange(properyName: "width" | "height" | "treeChance" | "villageRate") {
        const value = this.state[properyName];
        const rangeValue: { min: number, max: number, step?: number } = MapConfig.rangeValues[properyName]
        return (
            <input type="range"
                value={value}
                min={rangeValue.min} max={rangeValue.max} step={rangeValue.step || 1}
                onChange={(event) => { this.setRangeValue(properyName, event.target) }}
            />
        )
    }

    render() {
        const { children, newGame } = this.props
        const { width, height, treeChance, landFormOption } = this.state


        return <section>
            <h3>Customise World</h3>

            <table>
                <tbody>
                    <tr>
                        <td><label>Width</label></td>
                        <td>{this.renderRange('width')}</td>
                        <td><span>{width} squares</span></td>
                    </tr>
                    <tr>
                        <td><label>Height</label></td>
                        <td>{this.renderRange('height')}</td>
                        <td><span>{height} squares</span></td>
                    </tr>
                    <tr>
                        <td><label>forestation</label></td>
                        <td>{this.renderRange('treeChance')}</td>
                        <td><span>{(treeChance * 100).toFixed(0)}%</span></td>
                    </tr>
                    <tr>
                        <td><label>Villages</label></td>
                        <td>{this.renderRange('villageRate')}</td>
                        <td><span>{this.villageRateDescription}</span></td>
                    </tr>

                    <tr>
                        <td><label>land form</label></td>
                        <td>
                            <select value={landFormOption.id}
                                onChange={(event) => { this.setSelectValue('landFormOption', event.target) }}
                            >
                                {landFormOptions.map(landFormChoice => (
                                    <option
                                        key={`landFormOption-${landFormChoice.id}`}
                                        value={landFormChoice.id}>
                                        {landFormChoice.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td><span>{landFormOption.description}</span></td>
                    </tr>
                </tbody>
            </table>

            <button className={dialogueStyles.button} onClick={() => {
                newGame(makeGameStateFunction.randomWorld(
                    this.state,
                    { tutorialEnabled: false, numberOfFactions: 4 }
                ))
            }}>new game</button>

            {children}
        </section>
    }
}
