import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import styles from './gameContainer.module.css'

import gameActions from '../lib/gameActions'
import makeGameState from '../lib/makeGameState'

export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign(makeGameState.test(), {

        });

        this.gameHolderElement = React.createRef()

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleUnitFigureClick = this.handleUnitFigureClick.bind(this)
        this.handleInterfaceButton = this.handleInterfaceButton.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        return this.setState(gameActions.handleMapSquareClick(mapSquare))
    }

    handleUnitFigureClick(unit) {
        return this.setState(gameActions.handleUnitClick(unit))
    }

    handleInterfaceButton(command, input = {}) {
        const centerOnSelectedUnit = () => this.scrollToSquare(this.state.selectedUnit);

        switch (command) {
            case "END_OF_TURN": return this.setState(gameActions.endOfTurn, centerOnSelectedUnit);
            case "NEXT_UNIT": return this.setState(gameActions.selectNextUnit, centerOnSelectedUnit);
            case "PREVIOUS_UNIT": return this.setState(gameActions.selectPreviousUnit, centerOnSelectedUnit);
            case "CENTER_MAP": return this.scrollToSquare(input);
            default: return console.warn(`unknown command: ${command}`)
        }

    }

    scrollToSquare(target) {
        if (!target) { return false }
        const { x, y } = target

        let pixelX = (x * 4 * 16) - this.gameHolderElement.current.clientWidth / 2 + (2 * 16)
        let pixelY = (y * 4 * 16) - this.gameHolderElement.current.clientHeight / 2 + (2 * 16)
        this.gameHolderElement.current.scrollTo(pixelX, pixelY)
    }

    render() {
        const { mapGrid, selectedSquare, units, selectedUnit } = this.state

        return (

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        units={units}
                        mapGrid={mapGrid}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleUnitFigureClick={this.handleUnitFigureClick}
                        selectedSquare={selectedSquare}
                        selectedUnit={selectedUnit} />
                </article>
                <article className={styles.interfaceWindowHolder} >
                    <InterfaceWindow
                        selectedUnit={selectedUnit}
                        selectedSquare={selectedSquare}
                        handleInterfaceButton={this.handleInterfaceButton} />
                </article>
            </div>
        )
    }
}