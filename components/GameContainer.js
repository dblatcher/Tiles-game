import React from 'react'

import TileBoard from './TileBoard'
import InfoBar from './InfoBar'
import BattleDialogue from './BattleDialogue'
import MessageDialogue from './MessageDialogue'
import TextQuestionDialogue from './TextQuestionDialogue'
import ModeButtons from './ModeButtons'
import TurnButtons from './TurnButtons'
import PickUnitDialogue from './PickUnitDialogue'
import TownView from './TownView'
import MainMenu from './MainMenu'
import FactionWindow from './FactionWindow'

import gameActions from '../lib/game-logic/gameActions'
import townActions from '../lib/game-logic/townActions'
import factionActions from '../lib/game-logic/factionActions'

import {browserHasLocalStorage} from '../lib/storage'
import handleStorageAction from './gameContainer.handleStorageAction'

import styles from './gameContainer.module.scss'


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
            factionWindowIsOpen: false,
            pendingDialogues: [],
            mainMenuOpen: false,
            mapZoomLevel: 1,
            browserSupportsLocalStorage: undefined
        });

        this.gameHolderElement = React.createRef()
        this.upperWindowElement = React.createRef()

        this.changeMode = this.changeMode.bind(this)
        this.scrollToSquare = this.scrollToSquare.bind(this)
        this.closeTownView = this.closeTownView.bind(this)
        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleTownAction = this.handleTownAction.bind(this)
        this.handleFactionAction = this.handleFactionAction.bind(this)
        this.handleOrderButton = this.handleOrderButton.bind(this)
        this.handleTileHoverEnter = this.handleTileHoverEnter.bind(this)
        this.handleDialogueButton = this.handleDialogueButton.bind(this)
        this.setMainMenuOpen = this.setMainMenuOpen.bind(this)
        this.toggleFactionWindow = this.toggleFactionWindow.bind(this)
        this.setMapZoomLevel = this.setMapZoomLevel.bind(this)

        this.handleStorageAction = handleStorageAction.bind(this)
    }

    componentDidMount() {
        this.setState({browserSupportsLocalStorage: browserHasLocalStorage()})
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

        this.setState(state => {
            const changeAmount = .2, max = 2, min = .4
            let newZoomLevel = state.mapZoomLevel

            if (directive === "IN") {
                newZoomLevel = Math.min(max, state.mapZoomLevel + changeAmount)
            } else if (directive === "OUT") {
                newZoomLevel = Math.max(min, state.mapZoomLevel - changeAmount)
            } else if (directive === "RESET") {
                newZoomLevel = 1
            }

            return {
                mapZoomLevel: newZoomLevel
            }
        })
    }

    toggleFactionWindow() {
        this.setState(state => {
            return { factionWindowIsOpen: !state.factionWindowIsOpen, fallenUnits: [] }
        })
    }

    closeTownView() {
        this.setState({
            openTown: null, fallenUnits: []
        })
    }

    handleMapSquareClick(input) {
        const { mapSquare } = input

        if (this.hasOpenDialogue) { return false }

        if (this.state.selectedUnit && this.state.interfaceMode === 'MOVE' && !this.state.selectedUnit.isAdjacentTo(mapSquare)) {
            return this.scrollToSquare(mapSquare)
        }

        return this.setState(
            gameActions.HANDLE_MAP_CLICK(input),
            () => {
                if (this.state.interfaceMode === 'VIEW') { this.scrollToSelection() }
            }
        )

    }


    handleOrderButton(command, input = {}) {
        if (this.hasOpenDialogue) { return false }
        if (!gameActions[command]) {
            console.warn(`unknown order button command ${command}`, input)
            return false
        }
        return this.setState(gameActions[command](input), this.scrollToSelection)
    }

    handleDialogueButton(command, input = {}) {
        let commandFunction = state => state;
        switch (command) {
            case "CANCEL_BATTLE": commandFunction = gameActions.cancelBattle; break;
            case "RESOLVE_BATTLE": commandFunction = gameActions.resolveBattle; break;
            case "ACKNOWLEDGE_MESSAGE": commandFunction = gameActions.acknowledgeMessage(input); break;
            case "PICK_UNIT": commandFunction = gameActions.pickUnit(input); break;
            case "EXECUTE_STATE_FUNCTION": commandFunction = input; break
            default:
                console.warn(`unknown dialogue command: ${command}`, input); return
        }
        return this.setState(commandFunction)
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
        if (this.hasOpenDialogue) { return false }
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
        const { mapZoomLevel } = this.state

        //to do - support left aligned interface window 
        const tileSize = (4 * 16 * mapZoomLevel)
        const leftBorderSize = (1 * 16)
        const topBorderSize = this.upperWindowElement.current
            ? this.upperWindowElement.current.offsetHeight
            : (12 * 16);


        let pixelX = (x * tileSize) - window.innerWidth / 2 + leftBorderSize + tileSize / 2
        let pixelY = (y * tileSize) - window.innerHeight / 2 + topBorderSize + tileSize / 2
        window.scrollTo(pixelX, pixelY)
    }

    renderDialogue() {
        const { pendingDialogues } = this.state

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
                confirmBattle={() => this.handleDialogueButton('RESOLVE_BATTLE', {})}
            />
        }

        if (pendingDialogues[0].type === "TextQuestion") {
            return <TextQuestionDialogue
                textQuestion={pendingDialogues[0]}
                handleDialogueButton={this.handleDialogueButton}
            />
        }

    }

    render() {
        const { mapGrid, selectedSquare, units, towns, activeFaction,
            selectedUnit, interfaceMode, interfaceModeOptions, fallenUnits,
            pendingDialogues, unitWithMenuOpen, unitPickDialogueChoices, openTown, mainMenuOpen, factionWindowIsOpen,
            mapZoomLevel,browserSupportsLocalStorage } = this.state

        if (openTown) {
            return (
                <TownView
                    town={openTown}
                    towns={towns}
                    closeTownView={this.closeTownView}
                    handleTownAction={this.handleTownAction}
                    mapGrid={mapGrid}
                    units={units} />
            )
        }

        if (factionWindowIsOpen) {
            return (
                <FactionWindow
                    faction={activeFaction}
                    towns={towns}
                    handleFactionAction={this.handleFactionAction}
                    closeWindow={this.toggleFactionWindow} />
            )
        }

        return (

            <>
                {pendingDialogues.length > 0 ? this.renderDialogue() : null}

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
                        mapZoomLevel={mapZoomLevel}
                    />
                </main>

                {!this.noActiveGame ? (<>
                    <aside className={styles.upperInterfaceWindow} ref={this.upperWindowElement} >

                        <InfoBar
                            selectedUnit={selectedUnit}
                            selectedSquare={selectedSquare}
                            scrollToSquare={this.scrollToSquare}
                            toggleFactionWindow={this.toggleFactionWindow}
                            activeFaction={activeFaction}
                            towns={towns}
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
                </>) : null}

                {mainMenuOpen || this.noActiveGame ? (
                    <MainMenu
                        setOpenFunction={this.setMainMenuOpen}
                        noActiveGame={this.noActiveGame}
                        storageAction={this.handleStorageAction}
                        browserSupportsLocalStorage= {browserSupportsLocalStorage}
                    />
                ) : null}
            </>
        )
    }
}