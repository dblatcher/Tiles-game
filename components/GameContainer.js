import React from 'react'

import TileBoard from './TileBoard'
import InfoBar from './InfoBar'
import BattleDialogue from './BattleDialogue'
import MessageDialogue from './MessageDialogue'
import QuestionDialogue from './QuestionDialogue'
import ModeButtons from './ModeButtons'
import TurnButtons from './TurnButtons'
import PickUnitDialogue from './PickUnitDialogue'
import ChooseResearchGoalDialogue from './ChooseResearchGoalDialogue'
import TownView from './TownView'
import MainMenu from './MainMenu'
import FactionWindow from './FactionWindow'

import processMapClick from '../lib/game-logic/processMapClick'
import gameActions from '../lib/game-logic/gameActions'
import townActions from '../lib/game-logic/townActions'
import factionActions from '../lib/game-logic/factionActions'

import { browserHasLocalStorage } from '../lib/storage'
import handleStorageAction from './gameContainer.handleStorageAction'

import styles from './gameContainer.module.scss'
import { areSamePlace } from '../lib/utility'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function asyncSetState(component, action) {
    return new Promise(resolve => {
        component.setState(action, resolve)
    })
}

export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);

        const interfaceModeOptions = [
            { value: "MOVE", description: "move units" },
            { value: "VIEW", description: "examine map" },
        ]

        this.state = Object.assign(props.startingGameState, {
            selectedSquare: null,
            interfaceMode: "MOVE",
            interfaceModeOptions,
            fallenUnits: [],
            unitPickDialogueChoices: [],
            openTown: null,
            factionWindowIsOpen: false,
            pendingDialogues: [],
            mainMenuOpen: false,
            mapZoomLevel: 1,
            mapXOffset: 3,
            mapShiftInProgress: false,
            browserSupportsLocalStorage: undefined,
            debug: props.debugMode ? { revealMap: true } : {}
        });

        this.gameHolderElement = React.createRef()
        this.upperWindowElement = React.createRef()

        this.changeMode = this.changeMode.bind(this)
        this.scrollToSquare = this.scrollToSquare.bind(this)
        this.scrollToSelection = this.scrollToSelection.bind(this)
        this.centerWindowOn = this.centerWindowOn.bind(this)
        this.centerOnSelection = this.centerOnSelection.bind(this)
        this.closeTownView = this.closeTownView.bind(this)
        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleTownAction = this.handleTownAction.bind(this)
        this.handleFactionAction = this.handleFactionAction.bind(this)
        this.handleOrderButton = this.handleOrderButton.bind(this)
        this.handleDialogueButton = this.handleDialogueButton.bind(this)
        this.setMainMenuOpen = this.setMainMenuOpen.bind(this)
        this.toggleFactionWindow = this.toggleFactionWindow.bind(this)
        this.setMapZoomLevel = this.setMapZoomLevel.bind(this)
        this.openTownView = this.openTownView.bind(this)
        this.endMapShift = this.endMapShift.bind(this)

        this.handleStorageAction = handleStorageAction.bind(this)
    }

    componentDidMount() {
        this.setState({ browserSupportsLocalStorage: browserHasLocalStorage() })
    }

    get stateOfPlay() {
        const { mapWidth } = this
        const { mapGrid, selectedSquare, units, towns, activeFaction, factions,
            selectedUnit, interfaceMode, interfaceModeOptions, fallenUnits,
            pendingDialogues, unitPickDialogueChoices, openTown, mainMenuOpen, factionWindowIsOpen,
            mapZoomLevel, mapXOffset, mapShiftInProgress,
            browserSupportsLocalStorage, debug,
        } = this.state

        return {
            mapWidth,
            mapGrid, selectedSquare, units, towns, activeFaction, factions,
            selectedUnit, interfaceMode, interfaceModeOptions, fallenUnits,
            pendingDialogues, unitPickDialogueChoices, openTown, mainMenuOpen, factionWindowIsOpen,
            mapZoomLevel, mapXOffset, mapShiftInProgress,
            browserSupportsLocalStorage, debug,
        }
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
        return this.state.activeFaction && this.state.activeFaction.isComputerPlayer
    }

    get hasOpenDialogue() {
        const { pendingDialogues, unitPickDialogueChoices } = this.state;
        return pendingDialogues.length > 0 || unitPickDialogueChoices.length > 0
    }

    get noActiveGame() {
        if (!this.state.mapGrid.length === 0) { return true }
        if (!this.state.activeFaction) { return true }
        return false
    }

    letComputerTakeItsTurn() {
        const { activeFaction, towns, units, mapGrid } = this.state
        const { primaryPlayerFaction } = this
        const placesInSight = primaryPlayerFaction.getPlacesInSight(towns, units, mapGrid[0].length)

        let computerHasFinished = false
        let unitThatMoved = null
        let unitThatMovedWasInViewBeforeMove = undefined
        let unitThatMovedWasInViewAfterMove = undefined
        let movesMade = 0
        let moveTimeStamp


        const letComputerMakeMove = () => {

            this.setState(
                state => {
                    moveTimeStamp = Date.now()
                    unitThatMoved = state.selectedUnit
                    unitThatMovedWasInViewBeforeMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
                    activeFaction.computerPersonality.makeMove(state)
                    movesMade++
                    computerHasFinished = activeFaction.computerPersonality.checkIfFinished(state, movesMade)
                    return state
                },
                async () => {
                    unitThatMovedWasInViewAfterMove = placesInSight.some(place => areSamePlace(place, unitThatMoved))
                    console.log(`****Move took: ${Date.now() - moveTimeStamp}ms`)
                    if (unitThatMovedWasInViewAfterMove || unitThatMovedWasInViewBeforeMove) {
                        this.scrollToSquare(unitThatMoved)
                        await sleep(250)
                    } else {
                        await sleep(10)
                    }

                    if (computerHasFinished) {
                        this.setState(
                            gameActions.END_OF_TURN()(this.state),
                            () => {
                                if (this.isComputerPlayersTurn) {
                                    this.letComputerTakeItsTurn()
                                } else {
                                    this.scrollToSelection('letComputerMakeMove, computerHasFinished')
                                }
                            }
                        )
                    } else {
                        letComputerMakeMove()
                    }
                })
        }

        console.log(`___${activeFaction.name.toUpperCase()} STARTING TURN____`)
        letComputerMakeMove()

    }


    setMainMenuOpen(shouldBeOpen) {
        this.setState(state => {
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
        this.setState(state => {
            return {
                factionWindowIsOpen: !state.factionWindowIsOpen,
                fallenUnits: []
            }
        })
    }

    openTownView(town) {
        this.setState({
            factionWindowIsOpen: false,
            fallenUnits: [],
            openTown: town
        })
    }

    closeTownView() {
        this.setState(
            { openTown: null, fallenUnits: [] },
            this.centerOnSelection
        )
    }

    handleMapSquareClick(input) {
        const { mapSquare } = input
        const { selectedUnit, interfaceMode, mapGrid } = this.state

        if (this.hasOpenDialogue || this.isComputerPlayersTurn) { return false }

        if (selectedUnit && interfaceMode === 'MOVE' && !selectedUnit.isAdjacentTo(mapSquare, mapGrid[0].length)) {
            return this.centerWindowOn(mapSquare)
        }

        return asyncSetState(this, processMapClick(input))
            .then(async () => {
                if (interfaceMode === 'MOVE' && selectedUnit !== this.state.selectedUnit) {

                    if (this.getDistanceFromEdge(this.state.selectedUnit) < 6) {
                        await sleep(225)
                        return this.centerWindowOn(this.state.selectedUnit)
                    }

                    await sleep(250)
                    return this.scrollToSquare(this.state.selectedUnit)
                }
                if (interfaceMode === 'VIEW') {
                    return this.centerWindowOn(mapSquare)
                }
            })
    }


    handleOrderButton(command, input = {}) {
        if (this.hasOpenDialogue || this.isComputerPlayersTurn) { return false }
        if (!gameActions[command]) {
            console.warn(`unknown order button command ${command}`, input)
            return false
        }
        return this.setState(
            gameActions[command](input),
            () => {
                if (this.isComputerPlayersTurn) { this.letComputerTakeItsTurn() }
                else {
                    this.centerWindowOn(this.state.selectedUnit)
                }
            }
        )
    }

    handleDialogueButton(command, input = {}) {
        if (command === 'EXECUTE_STATE_FUNCTION') {
            return this.setState(input)
        }

        if (!gameActions[command]) {
            console.warn(`unknown dialogue button command ${command}`, input)
            return false
        }
        return this.setState(gameActions[command](input))
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
        const { x } = target
        if (!target) { return false }
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
            mapShiftInProgress: true
        })
            .then(() => {
                this.scrollToSquare(target)
                this.endMapShift()
            })
    }

    endMapShift(delay = 500) {
        const that = this
        return async function () {
            await sleep(delay)
            await asyncSetState(that, { mapShiftInProgress: false })
        }()
    }

    scrollToSquare(target) {
        if (!target) { return false }
        const { x, y } = target
        const { mapZoomLevel, mapXOffset, mapGrid } = this.state
        const mapWidth = mapGrid[0].length

        //to do - support left aligned interface window
        const tileSize = (4 * 16 * mapZoomLevel)
        const leftBorderSize = (1 * 16)
        const topBorderSize = this.upperWindowElement.current
            ? this.upperWindowElement.current.offsetHeight
            : (12 * 16);

        let shiftedX = x - mapXOffset
        if (shiftedX < 0) { shiftedX += mapWidth }

        let pixelX = (shiftedX * tileSize) - window.innerWidth / 2 + leftBorderSize + tileSize / 2
        let pixelY = (y * tileSize) - window.innerHeight / 2 + topBorderSize + tileSize / 2
        window.scrollTo(pixelX, pixelY)
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

    }

    render() {
        const { mapGrid, activeFaction,
            selectedUnit, interfaceMode, interfaceModeOptions,
            pendingDialogues, unitPickDialogueChoices, openTown, mainMenuOpen, factionWindowIsOpen,
            browserSupportsLocalStorage, debug,
        } = this.state

        if (openTown) {
            return (
                <TownView
                    stateOfPlay={this.stateOfPlay}
                    closeTownView={this.closeTownView}
                    handleTownAction={this.handleTownAction}
                    openTownView={this.openTownView} />
            )
        }

        if (factionWindowIsOpen) {
            return (
                <FactionWindow
                    faction={activeFaction}
                    stateOfPlay={this.stateOfPlay}
                    openTownView={this.openTownView}
                    handleFactionAction={this.handleFactionAction}
                    handleTownAction={this.handleTownAction}
                    closeWindow={this.toggleFactionWindow} />
            )
        }

        return (

            <>
                {pendingDialogues.length > 0 && this.renderDialogue()}

                {unitPickDialogueChoices.length &&
                    <PickUnitDialogue
                        units={unitPickDialogueChoices}
                        handleDialogueButton={this.handleDialogueButton} />
                }

                <main className={styles.tileBoardHolder} ref={this.gameHolderElement}>
                    <TileBoard
                        stateOfPlay={this.stateOfPlay}
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

                        <InfoBar
                            stateOfPlay={this.stateOfPlay}
                            toggleFactionWindow={this.isComputerPlayersTurn ? null : this.toggleFactionWindow}
                            centerWindowOn={this.centerWindowOn}
                        />

                        <div>
                            <i className={["material-icons", "md-48", styles.menuButton].join(" ")}
                                onClick={() => { this.setMapZoomLevel('OUT') }}
                            >zoom_out</i>
                            <i className={["material-icons", "md-48", styles.menuButton].join(" ")}
                                onClick={() => { this.setMapZoomLevel('RESET') }}
                            >search</i>
                            <i className={["material-icons", "md-48", styles.menuButton].join(" ")}
                                onClick={() => { this.setMapZoomLevel('IN') }}
                            >zoom_in</i>
                            <i className={["material-icons", "md-48", styles.menuButton].join(" ")}
                                onClick={this.setMainMenuOpen}>
                                {mainMenuOpen ? "menu_open" : "menu"}
                            </i>
                        </div>
                    </aside>
                )}

                {!this.noActiveGame && !this.isComputerPlayersTurn && (
                    <aside className={styles.lowerInterfaceWindow} >
                        <ModeButtons
                            interfaceMode={interfaceMode}
                            changeMode={this.changeMode}
                            interfaceModeOptions={interfaceModeOptions}
                        />
                        <TurnButtons
                            selectedUnit={selectedUnit}
                            squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                            handleOrderButton={this.handleOrderButton}
                        />
                    </aside>
                )}

                {(mainMenuOpen || this.noActiveGame) && (
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