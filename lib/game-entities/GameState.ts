import { Town } from '../game-entities/Town'
import { Faction } from '../game-entities/Faction';
import { Unit } from '../game-entities/Unit';
import { MapSquare } from '../game-entities/MapSquare';

class GameState {
    towns: Array<Town>
    factions: Array<Faction>
    units: Array<Unit>
    selectedUnit: Unit|null
    mapGrid: Array<Array<MapSquare | null> | null>
}

export { GameState }