import React from 'react'

import TileBoard from './TileBoard'
import ModeButtons from './ModeButtons'
import TurnButtons from './TurnButtons'
import TownView from './TownView'
import MainMenu from './menu/MainMenu'
import FactionWindow from './FactionWindow'

import ControlBar from './interface/ControlBar'
import FactionButton from './interface/FactionButton'


import GameOverDialogue from './dialogue/GameOverDialogue'
import ChooseResearchGoalDialogue from './dialogue/ChooseResearchGoalDialogue'
import ChooseStolenTechDialogue from './dialogue/ChooseStolenTechDialogue'
import PickUnitDialogue from './dialogue/PickUnitDialogue'
import BattleDialogue from './dialogue/BattleDialogue'
import MessageDialogue from './dialogue/MessageDialogue'
import QuestionDialogue from './dialogue/QuestionDialogue'

import TutorialDialogue from './dialogue/TutorialDialogue'
import tutorialSystem from './gameContainer.tutorialSystem'

import processMapClick from '../lib/game-logic/processMapClick'
import gameActions from '../lib/game-logic/gameActions'
import townActions from '../lib/game-logic/townActions'
import factionActions from '../lib/game-logic/factionActions'
import { browserHasLocalStorage } from '../lib/storage'

import handleStorageAction from './gameContainer.handleStorageAction'
import letComputerTakeItsTurn from './gameContainer.letComputerTakeItsTurn'

import styles from './gameContainer.module.scss'
import { areSamePlace, sleep, asyncSetState } from '../lib/utility'
import InfoBlock from './interface/InfoBlock'
import { GameState, InitialGameState } from '../lib/game-entities/GameState'


class GameContainerProps {
    debugMode: boolean
    startingGameStateFunction: () => InitialGameState
}

export default class GameContainer extends React.Component {
    state: GameState
    gameHolderElement: React.RefObject<HTMLElement>
    upperWindowElement: React.RefObject<HTMLElement>
    handleStorageAction: Function
    letComputerTakeItsTurn: Function
    handleTutorialClick: Function
    setStateUpdateTutorialEvents: Function

    constructor(props: GameContainerProps) {
        super(props);

        this.state = new GameState(props.startingGameStateFunction(), props.debugMode)


        this.gameHolderElement = React.createRef()
        this.upperWindowElement = React.createRef()

        this.changeMode = this.changeMode.bind(this)
        this.scrollToSquare = this.scrollToSquare.bind(this)
        this.scrollToSelection = this.scrollToSelection.bind(this)
        this.centerWindowOn = this.centerWindowOn.bind(this)
        this.centerOnSelection = this.centerOnSelection.bind(this)
        this.activateUnit = this.activateUnit.bind(this)
        this.closeTownView = this.closeTownView.bind(this)
        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleTownAction = this.handleTownAction.bind(this)
        this.handleFactionAction = this.handleFactionAction.bind(this)
        this.handleOrderButton = this.handleOrderButton.bind(this)
        this.handleDialogueButton = this.handleDialogueButton.bind(this)
        this.setMainMenuOpen = this.setMainMenuOpen.bind(this)
        this.toggleFactionWindow = this.toggleFactionWindow.bind(this)
        this.openFactionWindow = this.openFactionWindow.bind(this)
        this.setMapZoomLevel = this.setMapZoomLevel.bind(this)
        this.openTownView = this.openTownView.bind(this)
        this.endMapShift = this.endMapShift.bind(this)
        this.reset = this.reset.bind(this)

        this.handleStorageAction = handleStorageAction.bind(this)
        this.letComputerTakeItsTurn = letComputerTakeItsTurn.bind(this)
        this.handleTutorialClick = tutorialSystem.handleTutorialClick.bind(this)
        this.setStateUpdateTutorialEvents = tutorialSystem.setStateUpdateTutorialEvents.bind(this)
    }

    componentDidMount() {
        this.setState({ browserSupportsLocalStorage: browserHasLocalStorage() })
    }

    reset() {
        const props = this.props as GameContainerProps;
        const newState = new GameState(props.startingGameStateFunction(), props.debugMode)
        this.setState(newState)
    }

    scrollToSelection() {
        return this.scrollToSquare(
            this.state.interfaceMode === 'MOVE'
                ? this.state.selectedUnit
                : this.state.selectedSquare
        );
    }

    centerOnSelection() {
        return this.centerWindowOn(
            this.state.interfaceMode === 'MOVE'
                ? this.state.selectedUnit
                : this.state.selectedSquare
        );
    }

    centerWindowOn(target) {
        if (!target) { return false }
        const { x } = target
        const { mapZoomLevel, mapGrid } = this.state
        const mapWidth = mapGrid[0].length

        const tileSize = (4 * 16 * mapZoomLevel)
        const windowWidthInTiles = Math.floor(window.innerWidth / tileSize)

        let newOffsetValue = x - Math.floor(windowWidthInTiles / 2)
        newOffsetValue -= Math.floor((mapWidth - windowWidthInTiles) / 2)
        while (newOffsetValue < 0) { newOffsetValue += mapWidth }
        while (newOffsetValue >= mapWidth) { newOffsetValue -= mapWidth }


        asyncSetState(this, {
            mapXOffset: newOffsetValue,
            mapShiftInProgress: true,
        })
            .then(() => {
                this.scrollToSquare(target)
                this.endMapShift()
            })
    }

    scrollToSquare(target) {
        if (!target) { return false }
        const { x, y } = target
        const { mapZoomLevel, mapXOffset, mapGrid } = this.state
        const { gameHolderElement, upperWindowElement } = this

        if (!gameHolderElement.current) { return }

        const mapWidth = mapGrid[0].length

        //to do - support left aligned interface window
        const tileSize = (4 * 16 * mapZoomLevel)
        const leftBorderSize = (1 * 16)
        const topBorderSize = upperWindowElement.current
            ? upperWindowElement.current.offsetHeight
            : (12 * 16);

        let shiftedX = x - mapXOffset
        if (shiftedX < 0) { shiftedX += mapWidth }

        let pixelX = (shiftedX * tileSize) - window.innerWidth / 2 + leftBorderSize + tileSize / 2
        let pixelY = (y * tileSize) - window.innerHeight / 2 + topBorderSize + tileSize / 2

        gameHolderElement.current.scrollTo(pixelX, pixelY)
    }

    endMapShift(delay = 500) {
        const that = this
        return async function () {
            await sleep(delay)
            await asyncSetState(that, { mapShiftInProgress: false })
        }()
    }


    get mapWidth() {
        return this.state.mapGrid && this.state.mapGrid[0]
            ? this.state.mapGrid[0].length
            : 0
    }

    getDistanceFromLeftEdge(target) {
        const { mapWidth } = this
        const { x } = target
        const { mapXOffset } = this.state

        return x < mapXOffset
            ? x - mapXOffset + mapWidth
            : x - mapXOffset
    }

    getDistanceFromRightEdge(target) {
        const { mapWidth } = this
        const { x } = target
        const { mapXOffset } = this.state
        let rightEdge = mapXOffset > 0
            ? mapXOffset - 1
            : mapWidth

        return x > rightEdge
            ? mapWidth - x + rightEdge
            : rightEdge - x
    }

    getDistanceFromEdge(target) {
        return Math.min(this.getDistanceFromRightEdge(target), this.getDistanceFromLeftEdge(target));
    }

    get primaryPlayerFaction() {
        const humanPlayers = this.state.factions.filter(faction => !faction.isComputerPlayer)
        return humanPlayers[0] || null
    }

    get isComputerPlayersTurn() {
        return this.state.activeFaction && this.state.activeFaction.isComputerPlayer && !this.state.gameOver
    }

    get hasOpenDialogue() {
        const { pendingDialogues, unitPickDialogueChoices } = this.state;
        return pendingDialogues.length > 0 || unitPickDialogueChoices.length > 0
    }

    get noActiveGame() {
        if (this.state.mapGrid.length == 0) { return true }
        if (!this.state.activeFaction && !this.state.gameOver) { return true }
        return false
    }

    setMainMenuOpen(shouldBeOpen) {
        this.setState((state: GameState) => {
            return {
                mainMenuOpen: typeof shouldBeOpen === 'boolean'
                    ? shouldBeOpen
                    : !state.mainMenuOpen,
                fallenUnits: []
            }
        })
    }

    setMapZoomLevel(directive) {

        const zoomLevels = [.125, .25, .5, 1, 1.5, 2]
        let newZoomLevel

        if (directive === "IN") {
            newZoomLevel = zoomLevels
                .filter(zoomLevel => zoomLevel > this.state.mapZoomLevel)[0]
                || zoomLevels[zoomLevels.length - 1]
        } else if (directive === "OUT") {
            newZoomLevel = zoomLevels
                .filter(zoomLevel => zoomLevel < this.state.mapZoomLevel)
                .reverse()[0]
                || zoomLevels[0]
        } else if (directive === "RESET") {
            newZoomLevel = 1
        }

        asyncSetState(this, {
            mapZoomLevel: newZoomLevel,
            mapShiftInProgress: true
        })
            .then(() => { this.endMapShift(20) })
            .then(this.centerOnSelection)
    }

    toggleFactionWindow() {
        this.setStateUpdateTutorialEvents(state => {
            return {
                factionWindowIsOpen: !state.factionWindowIsOpen,
                fallenUnits: []
            }
        })
    }

    openFactionWindow() {
        this.setStateUpdateTutorialEvents({
            factionWindowIsOpen: true,
            openTown: null
        })
    }

    openTownView(town) {
        this.setStateUpdateTutorialEvents({
            factionWindowIsOpen: false,
            fallenUnits: [],
            openTown: town
        })
    }

    closeTownView() {
        this.setStateUpdateTutorialEvents(
            { openTown: null, fallenUnits: [] },
            this.centerOnSelection
        )
    }

    handleMapSquareClick(input, wasRightClick = false) {

        const { mapSquare } = input
        const { selectedUnit, interfaceMode, mapGrid } = this.state

        if (this.hasOpenDialogue || this.isComputerPlayersTurn) { return false }

        let effectiveMode = wasRightClick ? 'VIEW' : interfaceMode;

        if (selectedUnit && effectiveMode === 'MOVE' && !selectedUnit.isAdjacentTo(mapSquare, mapGrid[0].length)) {
            return this.centerWindowOn(mapSquare)
        }

        return asyncSetState(this, processMapClick(input, effectiveMode))
            .then(async () => {

                asyncSetState(this, (state: GameState) => {
                    if (state.tutorial) { state.tutorial.updateEvents(state) }
                    return state
                })

            })
            .then(async () => {
                if (effectiveMode === 'MOVE' && selectedUnit !== this.state.selectedUnit) {

                    if (this.getDistanceFromEdge(this.state.selectedUnit) < 6) {
                        await sleep(225)
                        return this.centerWindowOn(this.state.selectedUnit)
                    }

                    await sleep(250)
                    return this.scrollToSquare(this.state.selectedUnit)
                }
                if (effectiveMode === 'VIEW') {
                    return this.centerWindowOn(mapSquare)
                }
            })
    }


    handleOrderButton(command, input = {}) {
        if (this.hasOpenDialogue || this.isComputerPlayersTurn || this.state.gameOver) { return false }
        if (!gameActions[command]) {
            console.warn(`unknown order button command ${command}`, input)
            return false
        }
        return this.setStateUpdateTutorialEvents(gameActions[command](input),

            () => {
                if (this.isComputerPlayersTurn && !this.state.gameOver) {
                    this.letComputerTakeItsTurn()
                }
                else {
                    this.centerWindowOn(this.state.selectedUnit)
                }
            }
        )
    }

    handleDialogueButton(command, input = {}) {
        if (command === 'EXECUTE_STATE_FUNCTION') {
            return this.setStateUpdateTutorialEvents(input)
        }

        if (!gameActions[command]) {
            console.warn(`unknown dialogue button command ${command}`, input)
            return false
        }
        return this.setStateUpdateTutorialEvents(gameActions[command](input))
    }

    handleTownAction(command, input = {}) {
        if (!townActions[command]) {
            console.warn(`unknown town command: ${command}`, input); return
        }
        return this.setState(townActions[command](input))
    }

    handleFactionAction(command, input = {}) {
        if (!factionActions[command]) {
            console.warn(`unknown faction command: ${command}`, input); return
        }
        return this.setState(factionActions[command](input))
    }

    changeMode(newMode) {
        if (this.hasOpenDialogue || this.isComputerPlayersTurn) { return false }
        this.setState({
            interfaceMode: newMode
        })
    }

    activateUnit(unit) {
        asyncSetState(this, {
            factionWindowIsOpen: false,
            openTown: null,
            selectedUnit: unit,
        })
            .then(this.centerOnSelection)
    }

    renderDialogue() {
        const { pendingDialogues, activeFaction } = this.state

        if (pendingDialogues[0].type === "Message") {
            return <MessageDialogue
                message={pendingDialogues[0]}
                acknowledgeMessage={() => this.handleDialogueButton('ACKNOWLEDGE_MESSAGE', {})}
            />
        }

        if (pendingDialogues[0].type === "Battle") {
            return <BattleDialogue
                battle={pendingDialogues[0]}
                cancelBattle={() => this.handleDialogueButton('CANCEL_BATTLE', {})}
                confirmBattle={() => this.handleDialogueButton('RESOLVE_BATTLE', { battle: pendingDialogues[0] })}
            />
        }

        if (pendingDialogues[0].type === "TextQuestion" || pendingDialogues[0].type === "OptionsQuestion") {
            return <QuestionDialogue
                question={pendingDialogues[0]}
                handleDialogueButton={this.handleDialogueButton}
            />
        }

        if (pendingDialogues[0].type === "TechDiscoveryChoice") {
            return <ChooseResearchGoalDialogue
                activeFaction={activeFaction}
                handleDialogueButton={this.handleDialogueButton}
            />
        }

        if (pendingDialogues[0].type === "TechStealQuestion") {
            return <ChooseStolenTechDialogue
                question={pendingDialogues[0]}
                activeFaction={activeFaction}
                handleDialogueButton={this.handleDialogueButton}
            />
        }

    }

    render() {
        const { mapGrid, activeFaction,
            selectedUnit, interfaceMode,
            pendingDialogues, unitPickDialogueChoices, openTown, mainMenuOpen, factionWindowIsOpen,
            browserSupportsLocalStorage, debug, gameOver
        } = this.state

        const allUnitsMoved = !this.state.units.some(unit => unit.faction === this.primaryPlayerFaction && !unit.canMakeNoMoreMoves(this.state))

        if (openTown && !gameOver) {
            return (<>
                <TownView
                    stateOfPlay={this.state}
                    closeTownView={this.closeTownView}
                    handleTownAction={this.handleTownAction}
                    activateUnit={this.activateUnit}
                    openTownView={this.openTownView}
                    openFactionWindow={this.openFactionWindow} />
                <TutorialDialogue
                    tutorialState={this.state.tutorial}
                    stateOfPlay={this.state}
                    handleTutorialClick={this.handleTutorialClick} />
            </>)
        }

        if (factionWindowIsOpen && !gameOver) {
            return (<>
                <FactionWindow
                    faction={activeFaction}
                    stateOfPlay={this.state}
                    openTownView={this.openTownView}
                    handleFactionAction={this.handleFactionAction}
                    handleTownAction={this.handleTownAction}
                    closeWindow={this.toggleFactionWindow} />
                <TutorialDialogue
                    tutorialState={this.state.tutorial}
                    stateOfPlay={this.state}
                    handleTutorialClick={this.handleTutorialClick} />
            </>)
        }

        return (

            <>
                {(gameOver) &&
                    <GameOverDialogue
                        stateOfPlay={this.state}
                        watchingFaction={this.primaryPlayerFaction}
                        reset={this.reset}
                    />
                }

                {(pendingDialogues.length > 0 && !gameOver) && this.renderDialogue()}

                <TutorialDialogue
                    tutorialState={this.state.tutorial}
                    stateOfPlay={this.state}
                    handleTutorialClick={this.handleTutorialClick} />

                {(unitPickDialogueChoices.length > 0 && !gameOver) &&
                    <PickUnitDialogue
                        units={unitPickDialogueChoices}
                        handleDialogueButton={this.handleDialogueButton} />
                }

                <main className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        stateOfPlay={this.state}
                        gameHasOpenDialogue={this.hasOpenDialogue}
                        debug={debug}
                        watchingFaction={this.primaryPlayerFaction}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleOrderButton={this.handleOrderButton}
                    />
                </main>

                {!this.noActiveGame && this.isComputerPlayersTurn && (
                    <aside className={styles.lowerInterfaceWindow} >
                        <p className={styles.waitMessage}>{activeFaction.name} is taking its turn...</p>
                    </aside>
                )}

                {!this.noActiveGame && !this.isComputerPlayersTurn && (
                    <aside className={styles.upperInterfaceWindow} ref={this.upperWindowElement} >
                        <ControlBar
                            interfaceMode={interfaceMode}
                            setMapZoomLevel={this.setMapZoomLevel}
                            setMainMenuOpen={this.setMainMenuOpen}
                            centerOnSelection={this.centerOnSelection}
                            mainMenuOpen={mainMenuOpen}>


                            <FactionButton
                                stateOfPlay={this.state}
                                faction={this.primaryPlayerFaction}
                                toggleFactionWindow={this.isComputerPlayersTurn ? null : this.toggleFactionWindow} />
                            <InfoBlock
                                stateOfPlay={this.state}
                                watchingFaction={this.primaryPlayerFaction}
                                centerWindowOn={this.centerWindowOn} />

                        </ControlBar>
                    </aside>
                )}

                {!this.noActiveGame && !this.isComputerPlayersTurn && !gameOver && (
                    <aside className={styles.lowerInterfaceWindow} >
                        <ModeButtons
                            interfaceMode={interfaceMode}
                            changeMode={this.changeMode}
                        />
                        <TurnButtons
                            allUnitsMoved={allUnitsMoved}
                            handleOrderButton={this.handleOrderButton}
                        />
                    </aside>
                )}

                {((mainMenuOpen && !gameOver) || this.noActiveGame) && (
                    <MainMenu
                        setOpenFunction={this.setMainMenuOpen}
                        noActiveGame={this.noActiveGame}
                        storageAction={this.handleStorageAction}
                        browserSupportsLocalStorage={browserSupportsLocalStorage}
                    />
                )}
            </>
        )
    }
}