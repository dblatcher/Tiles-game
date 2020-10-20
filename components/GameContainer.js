import React from 'react'
import TileBoard from './TileBoard'
import SeletedUnitAndSquareInfo from './SeletedUnitAndSquareInfo'
import BattleDialogue from './BattleDialogue'
import MessageDialoge from './MessageDialogue'
import ModeButtons from './ModeButtons'
import TurnButtons from './TurnButtons'

import styles from './gameContainer.module.scss'
import gameActions from '../lib/gameActions'
import PickUnitDialogue from './PickUnitDialogue'
import TownView from './TownView'




export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);

        const interfaceModeOptions = [
            { value: "MOVE", description: "move units" },
            { value: "VIEW", description: "examine map" },
        ]

        this.state = Object.assign(props.startingGameState, {
            selectedSquare: null,
            unitWithMenuOpen: null,
            interfaceMode: "MOVE",
            interfaceModeOptions,
            fallenUnits: [],
            unitPickDialogueChoices: [],
            openTown: null,
            pendingBattle: null,
            pendingMessage: null,
        });

        this.gameHolderElement = React.createRef()
        this.upperWindowElement = React.createRef()

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleOrderButton = this.handleOrderButton.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.handleTileHoverEnter = this.handleTileHoverEnter.bind(this)
        this.scrollToSquare = this.scrollToSquare.bind(this)
        this.handleDialogueButton = this.handleDialogueButton.bind(this)
        this.closeTownView = this.closeTownView.bind(this)
    }

    get hasOpenDialogue() {
        const { pendingBattle, pendingMessage, unitPickDialogueChoices } = this.state;
        return pendingBattle || pendingMessage || unitPickDialogueChoices.length > 0
    }

    closeTownView() {
        this.setState({
            openTown: null
        })
    }

    handleMapSquareClick(mapSquare) {
        if (this.hasOpenDialogue) { return false }

        if (this.state.selectedUnit && this.state.interfaceMode === 'MOVE' && !this.state.selectedUnit.isAdjacentTo(mapSquare)) {
            return this.scrollToSquare(mapSquare)
        }

        return this.setState(gameActions.handleMapSquareClick(mapSquare), () => {
            if (this.state.interfaceMode === 'VIEW') { this.scrollToSelection() }
        })

    }


    handleOrderButton(command, input = {}) {
        if (this.hasOpenDialogue) { return false }
        let commandFunction = state => state;
        switch (command) {
            case "END_OF_TURN": commandFunction = gameActions.endOfTurn; break;
            case "NEXT_UNIT": commandFunction = gameActions.selectNextUnit; break;
            case "PREVIOUS_UNIT": commandFunction = gameActions.selectPreviousUnit; break;
            case "START_ORDER": commandFunction = gameActions.startOrder(input); break;
            case "CANCEL_ORDER": commandFunction = gameActions.cancelOrder; break;
            default:
                console.warn(`unknown command: ${command}`, input); return
        }

        return this.setState(commandFunction, this.scrollToSelection)
    }

    handleDialogueButton(command, input = {}) {
        let commandFunction = state => state;
        switch (command) {
            case "CANCEL_BATTLE": commandFunction = gameActions.cancelBattle; break;
            case "RESOLVE_BATTLE": commandFunction = gameActions.resolveBattle; break;
            case "ACKNOWLEDGE_MESSAGE": commandFunction = gameActions.acknowledgeMessage(input); break;
            case "PICK_UNIT": commandFunction = gameActions.pickUnit(input); break;
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

        //to do - support left aligned interface window 
        const tileSize = (4 * 16)
        const leftBorderSize = (1 * 16)
        const topBorderSize = this.upperWindowElement.current
            ? this.upperWindowElement.current.offsetHeight
            : (12 * 16);


        let pixelX = (x * tileSize) - window.innerWidth / 2 + leftBorderSize + tileSize / 2
        let pixelY = (y * tileSize) - window.innerHeight / 2 + topBorderSize + tileSize / 2
        window.scrollTo(pixelX, pixelY)
    }


    render() {
        const { mapGrid, selectedSquare, units, towns,
            selectedUnit, interfaceMode, interfaceModeOptions, fallenUnits, 
            pendingBattle, pendingMessage, unitWithMenuOpen, unitPickDialogueChoices, openTown } = this.state

        if (openTown) { return (
            <TownView 
            town={openTown} 
            closeTownView={this.closeTownView} 
            mapGrid={mapGrid}
            units={units}/>
        )}

        return (

            <>
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

                {unitPickDialogueChoices.length > 0
                    ? <PickUnitDialogue
                        units={unitPickDialogueChoices}
                        handleDialogueButton={this.handleDialogueButton} />
                    : null}

                <main className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        units={units}
                        towns={towns}
                        unitWithMenuOpen={unitWithMenuOpen}
                        mapGrid={mapGrid}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleTileHoverEnter={this.handleTileHoverEnter}
                        handleOrderButton={this.handleOrderButton}
                        interfaceMode={interfaceMode}
                        selectedSquare={selectedSquare}
                        selectedUnit={selectedUnit}
                        fallenUnits={fallenUnits}
                        gameHasOpenDialogue={this.hasOpenDialogue}
                    />
                </main>

                <aside className={styles.upperInterfaceWindow} ref={this.upperWindowElement} >
                    <SeletedUnitAndSquareInfo
                        selectedUnit={selectedUnit}
                        selectedSquare={selectedSquare}
                        scrollToSquare={this.scrollToSquare}
                    />

                    <ModeButtons
                        interfaceMode={interfaceMode}
                        changeMode={this.changeMode}
                        interfaceModeOptions={interfaceModeOptions}
                    />
                </aside>

                <aside className={styles.lowerInterfaceWindow} >
                    <TurnButtons
                        selectedUnit={selectedUnit}
                        squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                        handleOrderButton={this.handleOrderButton}
                    />
                </aside>

            </>
        )
    }
}