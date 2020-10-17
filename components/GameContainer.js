import React from 'react'
import TileBoard from './TileBoard'
import SeletedUnitAndSquareInfo from './SeletedUnitAndSquareInfo'
import BattleDialogue from './BattleDialogue'
import MessageDialoge from './MessageDialogue'
import ModeButtons from './ModeButtons'
import OrderButtons from './OrderButtons'

import styles from './gameContainer.module.css'
import gameActions from '../lib/gameActions'




export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);

        const interfaceModeOptions = [
            { value: "MOVE", description: "move units" },
            { value: "VIEW", description: "examine map" },
        ]

        this.state = Object.assign(props.startingGameState, {
            interfaceMode: "MOVE",
            interfaceModeOptions,
            fallenUnits: [],
            pendingBattle: null,
            pendingMessage: null,
        });

        this.gameHolderElement = React.createRef()

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleOrderButton = this.handleOrderButton.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.handleTileHoverEnter = this.handleTileHoverEnter.bind(this)
        this.scrollToSquare = this.scrollToSquare.bind(this)
        this.handleDialogueButton = this.handleDialogueButton.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        if (this.state.pendingBattle || this.state.pendingMessage) { return false }

        if (this.state.selectedUnit && this.state.interfaceMode === 'MOVE' && !this.state.selectedUnit.isAdjacentTo(mapSquare)) {
            return this.scrollToSquare(mapSquare)
        }

        return this.setState(gameActions.handleMapSquareClick(mapSquare), () => {
            if (this.state.interfaceMode === 'VIEW') { this.scrollToSelection() }
        })

    }


    handleOrderButton(command, input = {}) {
        if (this.state.pendingBattle || this.state.pendingMessage) { return false }
        let commandFunction = state => state;
        switch (command) {
            case "END_OF_TURN": commandFunction = gameActions.endOfTurn; break;
            case "NEXT_UNIT": commandFunction = gameActions.selectNextUnit; break;
            case "PREVIOUS_UNIT": commandFunction = gameActions.selectPreviousUnit; break;
            case "HOLD_UNIT": commandFunction = gameActions.holdUnit; break;
            case "START_ORDER": commandFunction = gameActions.startOrder(input); break;
            case "CANCEL_ORDER": commandFunction = gameActions.cancelOrder; break;
            default:
                console.warn(`unknown command: ${command}`, input); return
        }

        return this.setState(commandFunction, this.scrollToSelection)
    }

    handleDialogueButton (command, input = {}) {
        let commandFunction = state => state;
        switch (command) {
            case "CANCEL_BATTLE": commandFunction = gameActions.cancelBattle; break;
            case "RESOLVE_BATTLE": commandFunction = gameActions.resolveBattle; break;
            case "ACKNOWLEDGE_MESSAGE": commandFunction = gameActions.acknowledgeMessage(input); break;
            default:
                console.warn(`unknown command: ${command}`, input); return
        }

        return this.setState(commandFunction)
    }

    changeMode(newMode) {
        if (this.state.pendingBattle || this.state.pendingMessage) { return false }
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
        const { mapGrid, selectedSquare, units, selectedUnit, interfaceMode, interfaceModeOptions, fallenUnits, pendingBattle,pendingMessage } = this.state

        return (

            <div className={styles.gameHolder}>

                {pendingBattle
                    ? <BattleDialogue
                        battle={pendingBattle}
                        cancelBattle={() => this.handleDialogueButton('CANCEL_BATTLE', {})}
                        confirmBattle={() => this.handleDialogueButton('RESOLVE_BATTLE', {})} />
                    : null}

                {pendingMessage
                    ? <MessageDialoge
                        message={pendingMessage}
                        acknowledgeMessage={() => this.handleDialogueButton('ACKNOWLEDGE_MESSAGE', {})} />
                    : null}

                <article className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        units={units}
                        mapGrid={mapGrid}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleTileHoverEnter={this.handleTileHoverEnter}
                        interfaceMode={interfaceMode}
                        selectedSquare={selectedSquare}
                        selectedUnit={selectedUnit}
                        fallenUnits={fallenUnits} />
                </article>

                <article className={styles.interfaceWindowHolder} >
                    <SeletedUnitAndSquareInfo
                        selectedUnit={selectedUnit}
                        selectedSquare={selectedSquare}
                        scrollToSquare={this.scrollToSquare}
                    />
                    <OrderButtons
                        selectedUnit={selectedUnit}
                        squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                        handleOrderButton={this.handleOrderButton}
                    />
                    <ModeButtons
                        interfaceMode={interfaceMode}
                        changeMode={this.changeMode}
                        interfaceModeOptions={interfaceModeOptions}
                    />
                </article>
            </div>
        )
    }
}