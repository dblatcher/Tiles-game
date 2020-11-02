
class SpriteSheet {
    name: String;
    cols: number;
    rows: number;
    getRightFromAdjacentSquares: Function;
    css: object;
    frameNames: object;
    constructor(name: String, config: Object = {}) {
        this.name = name;
        this.cols = config.cols || 1;
        this.rows = config.rows || 1;
        this.css = config.css || {};
        this.getRightFromAdjacentSquares = config.getRightFromAdjacentSquares || function () { return [0, 0] }
        this.frameNames = config.frameNames;
    }

    getFrameCalled(frameName) {
        if (!this.frameNames) {return [0,0]}
        return this.frameNames[frameName] || [0,0]
    }

    getStyleForFrame(frame) {
        return Object.assign({
            backgroundSize: `${this.cols * 100}% ${this.rows * 100}%`,
            backgroundPosition: `${100 * frame[0] / (this.cols - 1)}% ${100 * frame[1] / (this.rows - 1)}%`,
        }, this.css)
    }

    getStyleForFrameCalled(frameName) {
        return this.getStyleForFrame(this.getFrameCalled(frameName))
    }

    getStyleFromAdjacentSquares(adjacentSquares) {
        return this.getStyleForFrame(this.getRightFromAdjacentSquares(adjacentSquares))
    }

}

const trees = new SpriteSheet('trees', {
    cols: 3,
    rows: 4,
    css: {
        top: '-15%',
        backgroundImage: 'url(./trees.png)'
    },
    getRightFromAdjacentSquares(adjacents) {
        let bitString = ''

        if (adjacents) {
            bitString += adjacents.before && adjacents.before.tree ? "1" : "0";
            bitString += adjacents.after && adjacents.after.tree ? "1" : "0";
            bitString += adjacents.above && adjacents.above.tree ? "1" : "0";
            bitString += adjacents.below && adjacents.below.tree ? "1" : "0";
        } 

        switch (bitString) {
            case "": return [0, 0];
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

const coastlines = new SpriteSheet('coastlines', {
    cols: 4,
    rows: 4,
    css: {
        backgroundImage: 'url(./coastlines.png)'
    },
    getRightFromAdjacentSquares(adjacents) {
        let bitString = ''

        if (adjacents) {
            bitString += adjacents.before && !adjacents.before.isWater ? "1" : "0";
            bitString += adjacents.after && !adjacents.after.isWater ? "1" : "0";
            bitString += adjacents.above && !adjacents.above.isWater ? "1" : "0";
            bitString += adjacents.below && !adjacents.below.isWater ? "1" : "0";
        }

        //1 = land
        switch (bitString) {
            case "0111": return [1, 0];
            case "1011": return [3, 0];
            case "1101": return [0, 0];
            case "1110": return [2, 0];

            case "1010": return [0, 1];
            case "0110": return [1, 1];
            case "0101": return [2, 1];
            case "1001": return [3, 1];

            case "1000": return [0, 2];
            case "0001": return [1, 2];
            case "0100": return [2, 2];
            case "0010": return [3, 2];

            case "1111": return[0,3];
            case "0011": return[1,3];
            case "1100": return[2,3];
            case "0000": return[3,3];

            default: return [3, 3]
        }
    }
})

const innerCoastlines = new SpriteSheet('innerCoastlines', {
    cols: 4,
    rows: 4,
    css: {
        backgroundImage: 'url(./coastlines.png)'
    },
    getRightFromAdjacentSquares(adjacents) {
        let bitString = ''

        if (adjacents) {
            bitString += adjacents.before && adjacents.before.isWater ? "1" : "0";
            bitString += adjacents.after && adjacents.after.isWater ? "1" : "0";
            bitString += adjacents.above && adjacents.above.isWater ? "1" : "0";
            bitString += adjacents.below && adjacents.below.isWater ? "1" : "0";
        }

        //0 = land
        switch (bitString) {
            case "0111": return [1, 0];
            case "1011": return [3, 0];
            case "1101": return [0, 0];
            case "1110": return [2, 0];

            case "1010": return [0, 1];
            case "0110": return [1, 1];
            case "0101": return [2, 1];
            case "1001": return [3, 1];

            case "1000": return [0, 2];
            case "0001": return [1, 2];
            case "0100": return [2, 2];
            case "0010": return [3, 2];

            case "1111": return[0,3];
            case "0011": return[1,3];
            case "1100": return[2,3];
            case "0000": return[3,3];

            default: return [3, 3]
        }
    }
})


const roads = new SpriteSheet('roads', {
    cols: 3,
    rows: 6,
    css: {
        backgroundImage: 'url(./roads.png)'
    },
    getRightFromAdjacentSquares(adjacents) {
        let bitString = ''

        if (adjacents) {
            bitString += adjacents.before && adjacents.before.road ? "1" : "0";
            bitString += adjacents.after && adjacents.after.road ? "1" : "0";
            bitString += adjacents.above && adjacents.above.road ? "1" : "0";
            bitString += adjacents.below && adjacents.below.road ? "1" : "0";
        }

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

            case "0110": return [0, 3];
            case "1010": return [1, 3];
            
            case "1110": return [0,4];
            case "1111": return [1,4];
            case "1011": return [2,4];
            
            case "1101": return [0,5];
            case "0111": return [1,5];


            default: return [1, 4]
        }
    }
})

const units = new SpriteSheet ('units',{
    cols: 3,
    rows: 4,
    css: {
        backgroundImage: 'url(./units.png)'
    },
    frameNames: {
        'shadow': [0,0],
        'person': [1,0],
        'swordsman': [2,0],
        'spearman': [0,1],
        'worker': [1,1],
        'unemployed': [2,1],
        'warrior':[0,2],
        'horseman':[1,2],
        'archer':[1,2],
        'knight':[0,3],
        'settler':[1,3],
        'scientist':[2,3],
    }
})

const spriteSheets = { trees,roads,coastlines,innerCoastlines, units }


export { spriteSheets, SpriteSheet }