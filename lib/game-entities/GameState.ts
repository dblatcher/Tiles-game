import { Town } from '../game-entities/Town'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { Message, TechDiscoveryChoice } from '../game-entities/Message';
import { TextQuestion, OptionsQuestion, TechStealQuestion } from './Questions';
import { TutorialState } from '../game-misc/tutorial';
import { Village } from './Village';

const startingInterfaceState = {
    selectedSquare: null,
    interfaceMode: "MOVE",
    fallenUnits: [],
    unitPickDialogueChoices: [],
    openTown: null,
    factionWindowIsOpen: false,
    pendingDialogues: [],
    mainMenuOpen: false,
    mapZoomLevel: 1,
    mapXOffset: 0,
    mapShiftInProgress: false,
    gameOver: false,
}



class InitialGameState {
    mapGrid: MapSquare[][]
    factions: Faction[]
    units: Unit[]
    towns: Town[]
    villages: Village[]
    activeFaction: Faction
    selectedUnit: Unit
    turnNumber: number
    tutorial?: TutorialState

    constructor() {
        this.mapGrid = MapSquare.makeGrid(0, 0, (x, y) => null)
        this.factions = []
        this.units = []
        this.towns = []
        this.villages = []
        this.activeFaction = null
        this.selectedUnit = null
        this.turnNumber = 1
    }
}

class GameState {

    mapGrid: MapSquare[][]
    factions: Faction[]
    units: Unit[]
    towns: Town[]
    villages: Village[]
    activeFaction: Faction
    selectedUnit: Unit
    turnNumber: number
    tutorial?: TutorialState

    pendingDialogues: Array<Message | TextQuestion | OptionsQuestion | TechDiscoveryChoice | TechStealQuestion>
    mapZoomLevel: number
    mapXOffset: number
    mapShiftInProgress: boolean
    fallenUnits: Array<Unit>
    unitPickDialogueChoices: Array<Unit>
    openTown: Town
    mainMenuOpen: boolean
    factionWindowIsOpen: boolean
    interfaceMode: "VIEW" | "MOVE"
    gameOver: boolean

    selectedSquare?: MapSquare
    browserSupportsLocalStorage?: boolean
    debug: {
        revealMap?: boolean
    }

    constructor(initialState: InitialGameState, isDebug: boolean) {
        Object.assign(this, initialState, startingInterfaceState)
        this.debug = isDebug ? { revealMap: true } : {}
    }

    get mapWidth() {
        return this.mapGrid && this.mapGrid[0]
            ? this.mapGrid[0].length
            : 0
    }

    get isComputerPlayersTurn() {
        return this.activeFaction && this.activeFaction.isComputerPlayer && !this.gameOver
    }
}

export { GameState, InitialGameState, startingInterfaceState }