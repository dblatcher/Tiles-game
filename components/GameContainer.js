import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import styles from './gameContainer.module.css'

import gameActions from '../lib/gameActions'
import makeGameState from '../lib/makeGameState'




export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);

        const interfaceModeOptions = [
            { value: "MOVE", description: "move units" },
            { value: "VIEW", description: "examine map" },
        ]

        this.state = Object.assign(makeGameState.test(), {
            interfaceMode: "MOVE",
            interfaceModeOptions,
        });

        this.gameHolderElement = React.createRef()

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleUnitFigureClick = this.handleUnitFigureClick.bind(this)
        this.handleInterfaceButton = this.handleInterfaceButton.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.handleTileHoverEnter = this.handleTileHoverEnter.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        return this.setState(gameActions.handleMapSquareClick(mapSquare), () => {
            if (this.state.interfaceMode === 'VIEW') { this.scrollToSelection() }
        })
    }

    handleUnitFigureClick(unit) {
        return this.setState(gameActions.handleUnitClick(unit), () => {
            if (this.state.interfaceMode === 'VIEW') { this.scrollToSelection() }
        })
    }

    handleInterfaceButton(command, input = {}) {

        switch (command) {
            case "END_OF_TURN": return this.setState(gameActions.endOfTurn, this.scrollToSelection);
            case "NEXT_UNIT": return this.setState(gameActions.selectNextUnit, this.scrollToSelection);
            case "PREVIOUS_UNIT": return this.setState(gameActions.selectPreviousUnit, this.scrollToSelection);
            case "CENTER_MAP": return this.scrollToSquare(input);
            default: return console.warn(`unknown command: ${command}`)
        }

    }

    changeMode(newMode) {
        this.setState({
            interfaceMode: newMode
        })
    }

    handleTileHoverEnter(mapSquare) {
        if (this.state.interfaceMode !== 'VIEW') {
            this.setState({ selectedSquare: mapSquare })
        }
    }

    scrollToSelection() {
        return this.scrollToSquare(
            this.state.interfaceMode === 'MOVE'
                ? this.state.selectedUnit
                : this.state.selectedSquare
        );
    }

    scrollToSquare(target) {
        if (!target) { return false }
        const { x, y } = target

        let pixelX = (x * 4 * 16) - this.gameHolderElement.current.clientWidth / 2 + (2 * 16)
        let pixelY = (y * 4 * 16) - this.gameHolderElement.current.clientHeight / 2 + (2 * 16)
        this.gameHolderElement.current.scrollTo(pixelX, pixelY)
    }

    render() {
        const { mapGrid, selectedSquare, units, selectedUnit, interfaceMode, interfaceModeOptions } = this.state

        return (

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        units={units}
                        mapGrid={mapGrid}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleUnitFigureClick={this.handleUnitFigureClick}
                        handleTileHoverEnter={this.handleTileHoverEnter}
                        selectedSquare={selectedSquare}
                        selectedUnit={selectedUnit} />
                </article>
                <article className={styles.interfaceWindowHolder} >
                    <InterfaceWindow
                        selectedUnit={selectedUnit}
                        selectedSquare={selectedSquare}
                        handleInterfaceButton={this.handleInterfaceButton}
                        changeMode={this.changeMode}
                        interfaceMode={interfaceMode}
                        interfaceModeOptions={interfaceModeOptions}
                    />
                </article>
            </div>
        )
    }
}