
class SpriteSheet {
    name: String;
    cols: number;
    rows: number;
    getRightFrame: Function;
    css: object;
    constructor(name: String, config: Object = {}) {
        this.name = name;
        this.cols = config.cols || 1;
        this.rows = config.rows || 1;
        this.css = config.css || {};
        this.getRightFrame = config.getRightFrame || function () { return [0, 0] }
    }

    static getStyle(sprite: SpriteSheet, adjacentSquares) {

        let frame = sprite.getRightFrame(adjacentSquares)
    
    
        return Object.assign({
            backgroundSize: `${sprite.cols * 100}% ${sprite.rows * 100}%`,
            backgroundPosition: `${100 * frame[0] / (sprite.cols - 1)}% ${100 * frame[1] / (sprite.rows - 1)}%`,
        }, sprite.css)
    }

}

const trees = new SpriteSheet('trees', {
    cols: 3,
    rows: 4,
    css: {
        top: '-15%',
        backgroundImage: 'url(./trees.png)'
    },
    getRightFrame(adjacents) {
        let bitString = ''
        bitString += adjacents.before && adjacents.before.tree ? "1" : "0";
        bitString += adjacents.after && adjacents.after.tree ? "1" : "0";
        bitString += adjacents.above && adjacents.above.tree ? "1" : "0";
        bitString += adjacents.below && adjacents.below.tree ? "1" : "0";

        switch (bitString) {
            case "0000": return [0, 0];
            case "0010": return [1, 0];
            case "0001": return [2, 0];

            case "0100": return [0, 1];
            case "1000": return [1, 1];
            case "1100": return [2, 1];

            case "0011": return [0, 2];
            case "0101": return [1, 2];
            case "1001": return [2, 2];

            case "0110": return [0, 3]
            case "1010": return [1, 3]
            case "1111": return [2, 3];
            default: return [2, 3]
        }
    }
})

const roads = new SpriteSheet('roads', {
    cols: 3,
    rows: 4,
    css: {
        backgroundImage: 'url(./roads.png)'
    },
    getRightFrame(adjacents) {
        let bitString = ''
        bitString += adjacents.before && adjacents.before.road ? "1" : "0";
        bitString += adjacents.after && adjacents.after.road ? "1" : "0";
        bitString += adjacents.above && adjacents.above.road ? "1" : "0";
        bitString += adjacents.below && adjacents.below.road ? "1" : "0";

        switch (bitString) {
            case "0000": return [0, 0];
            case "0010": return [1, 0];
            case "0001": return [2, 0];

            case "0100": return [0, 1];
            case "1000": return [1, 1];
            case "1100": return [2, 1];

            case "0011": return [0, 2];
            case "0101": return [1, 2];
            case "1001": return [2, 2];

            case "0110": return [0, 3]
            case "1010": return [1, 3]
            case "1111": return [2, 3];
            default: return [2, 3]
        }
    }
})

const spriteSheets = { trees,roads }


export { spriteSheets, SpriteSheet }