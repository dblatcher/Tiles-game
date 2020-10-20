import { MapSquare } from "./MapSquare.tsx";
import { terrainTypes } from "./TerrainType.tsx";


export default class VoidMapSquare extends MapSquare {
    constructor(x,y) {
        super({terrain:terrainTypes.void },x,y);
    }
}
