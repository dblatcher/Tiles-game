import { MapSquare } from "./MapSquare.tsx";
import {TerrainType } from "./TerrainType.tsx";

const voidTerrain = new TerrainType('void', {
    css: {
        background: 'transparent',
    }
})

export default class VoidMapSquare extends MapSquare {
    constructor(x,y) {
        super({terrain:voidTerrain },x,y);
    }
}
