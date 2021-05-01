import { MapSquare } from "./MapSquare";
import { TerrainType } from "./TerrainType";

const voidTerrain = new TerrainType('void', {
    css: {
        background: 'transparent',
    }
})

export default class VoidMapSquare extends MapSquare {
    constructor(x, y) {
        super({ terrain: voidTerrain }, x, y);
    }
}
