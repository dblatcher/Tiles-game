import { Town } from '../game-entities/Town'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';
import { Message, TechDiscoveryChoice } from '../game-entities/Message';
import { TextQuestion, OptionsQuestion, TechStealQuestion } from './Questions';

class GameState {
    towns: Array<Town>
    factions: Array<Faction>
    units: Array<Unit>
    selectedUnit: Unit | null
    mapGrid: Array<Array<MapSquare | null> | null>
    activeFaction: Faction
    pendingDialogues: Array<Message | TextQuestion | OptionsQuestion | TechDiscoveryChoice | TechStealQuestion>
    mapZoomLevel: number
    mapXOffset: number
    mapShiftInProgress: boolean
    fallenUnits: Array<Unit>
    unitPickDialogueChoices: Array<Unit>
    openTown: Town
    mainMenuOpen: boolean
    factionWindowIsOpen: boolean
    interfaceMode: string
}

export { GameState }