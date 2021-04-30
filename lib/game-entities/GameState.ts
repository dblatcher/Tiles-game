import { Town } from '../game-entities/Town'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { Message, TechDiscoveryChoice } from '../game-entities/Message';
import { TextQuestion, OptionsQuestion, TechStealQuestion } from './Questions';
import { TutorialState } from '../game-misc/tutorial';


class InitialGameState {
    mapGrid: MapSquare[][]
    factions: Faction[]
    units: Unit[]
    towns: Town[]
    activeFaction: Faction
    selectedUnit: Unit
    turnNumber: number
    tutorial?: TutorialState

    constructor() {
        this.mapGrid = MapSquare.makeGrid(0, 0, (x, y) => null)
        this.factions = []
        this.units = []
        this.towns = []
        this.activeFaction = null
        this.selectedUnit = null
        this.turnNumber = 1
    }
}

class GameState extends InitialGameState {
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

}

export { GameState, InitialGameState }