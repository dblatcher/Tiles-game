import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import styles from './gameContainer.module.css'

import gameActions from '../lib/gameActions'
import makeGameState from '../lib/makeGameState'

export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = makeGameState.test();

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleUnitFigureClick = this.handleUnitFigureClick.bind(this)
        this.handleInterfaceButton = this.handleInterfaceButton.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        return this.setState ( gameActions.handleMapSquareClick(mapSquare) )
    }

    handleUnitFigureClick(unit) {
        return this.setState ( gameActions.handleUnitClick(unit) )
    }

    handleInterfaceButton (command) {

        switch (command) {
            case "END_OF_TURN": return this.setState( gameActions.endOfTurn);
            case "NEXT_UNIT": return this.setState( gameActions.selectNextUnit);
            case "PREVIOUS_UNIT": return this.setState( gameActions.selectPreviousUnit);
            default: return console.warn (`unknown command: ${command}`)
        }

    }

    render() {
        const { mapGrid, selectedSquare, units, selectedUnit } = this.state

        return (

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} >
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
                        handleInterfaceButton={this.handleInterfaceButton}/>
                </article>
            </div>
        )
    }
}