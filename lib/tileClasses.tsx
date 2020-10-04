function hexToRgb(hex: string) {
    if (typeof hex !== 'string') { return null }
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

class TileColorScheme {
    color1: string;
    color2: string;
    constructor(color1: string, color2: string) {
        this.color1 = color1;
        this.color2 = color2;
    }

    get rgb1() { return hexToRgb(this.color1) }
    get rgb2() { return hexToRgb(this.color2) }
}

const tileColorSchemes = {
    desert: new TileColorScheme('#ea5', '#661'),
    grass: new TileColorScheme('#6b5', '#ea5'),
    ice: new TileColorScheme('#fff', '#88f'),
    tundra: new TileColorScheme('#dfd', '#eee'),
    void: new TileColorScheme('#000', '#000'),
}

class TileData {
    colorScheme: TileColorScheme;
    road: Boolean;
    tileHeight: number;
    tileWidth: number;
    constructor(options: Object = {}) {
        this.colorScheme = tileColorSchemes[options.colorScheme] || tileColorSchemes.void
        this.road = !!options.road;
        this.tileHeight = options.tileHeight || 100;
        this.tileWidth = options.tileWidth || 100;
    }

    getCoords(containingSet: Array<Array<TileData>>) {
        if (!containingSet) { return null }
        let row, index;

        for (row = 0; row < containingSet.length; row++) {
            index = containingSet[row].indexOf(this)
            if (index !== -1) {
                return { x: index, y: row }
            }
        }
        return null
    }

    changeColorScheme(colorScheme: string) {
        this.colorScheme = tileColorSchemes[colorScheme] || tileColorSchemes.void
    }

    plotRoad(ctx, x: number, y: number, surroundingTiles: Array<Array<TileData>>) {
        const { colorScheme, tileWidth, tileHeight } = this
        let noConnectingSquares = true

        function drawConnectingRoad(toX, toY) {
            noConnectingSquares = false
            ctx.beginPath()
            ctx.lineWidth = 6
            ctx.strokeStyle = "#000"
            ctx.moveTo(x + tileWidth / 2, y + tileHeight / 2)
            ctx.lineTo(toX, toY)
            ctx.stroke()
            ctx.lineWidth = 4
            ctx.strokeStyle = "#aaaa50"
            ctx.moveTo(x + tileWidth / 2, y + tileHeight / 2)
            ctx.lineTo(toX, toY)
            ctx.stroke()
        }

        if (surroundingTiles[0][1] && surroundingTiles[0][1].road) {
            drawConnectingRoad(x + tileWidth / 2, y)
        }

        if (surroundingTiles[2][1] && surroundingTiles[2][1].road) {
            drawConnectingRoad(x + tileWidth / 2, y + tileHeight)
        }

        if (surroundingTiles[1][0] && surroundingTiles[1][0].road) {
            drawConnectingRoad(x, y + tileHeight / 2)
        }

        if (surroundingTiles[1][2] && surroundingTiles[1][2].road) {
            drawConnectingRoad(x + tileWidth, y + tileHeight / 2)
        }

        if (noConnectingSquares) {
            ctx.beginPath()
            ctx.lineWidth = 6
            ctx.strokeStyle = "#000"
            ctx.moveTo((x + tileWidth / 2) - tileWidth / 6, (y + tileHeight / 2) - tileHeight / 6)
            ctx.lineTo((x + tileWidth / 2) + tileWidth / 6, (y + tileHeight / 2) + tileHeight / 6)
            ctx.moveTo((x + tileWidth / 2) + tileWidth / 6, (y + tileHeight / 2) - tileHeight / 6)
            ctx.lineTo((x + tileWidth / 2) - tileWidth / 6, (y + tileHeight / 2) + tileHeight / 6)
            ctx.stroke()
            ctx.lineWidth = 4
            ctx.strokeStyle = "#aaaa50"
            ctx.moveTo((x + tileWidth / 2) - tileWidth / 6, (y + tileHeight / 2) - tileHeight / 6)
            ctx.lineTo((x + tileWidth / 2) + tileWidth / 6, (y + tileHeight / 2) + tileHeight / 6)
            ctx.moveTo((x + tileWidth / 2) + tileWidth / 6, (y + tileHeight / 2) - tileHeight / 6)
            ctx.lineTo((x + tileWidth / 2) - tileWidth / 6, (y + tileHeight / 2) + tileHeight / 6)
            ctx.stroke()
        }
    }

    plotBackground(ctx, x: number, y: number, surroundingTiles: Array<Array<TileData>>) {
        const { colorScheme, tileWidth, tileHeight } = this
        ctx.fillStyle = colorScheme.color1;
        ctx.fillRect(x, y, tileWidth, tileHeight)



        var imgData = ctx.createImageData(tileWidth, tileHeight);
        var i;
        for (i = 0; i < imgData.data.length; i += 4) {
            
            if (i%60 == 0 ) {
                imgData.data[i + 0] = colorScheme.rgb2.r;
                imgData.data[i + 1] = colorScheme.rgb2.g;
                imgData.data[i + 2] = colorScheme.rgb2.b;
                imgData.data[i + 3] = 255;
            } else {
                imgData.data[i + 0] = colorScheme.rgb1.r;
                imgData.data[i + 1] = colorScheme.rgb1.g;
                imgData.data[i + 2] = colorScheme.rgb1.b;
                imgData.data[i + 3] = 255;
            }
        }

        ctx.putImageData(imgData,x,y)
    }

    getPlotFunction(containingSet: Array<Array<TileData>>) {
        const thisTile = this;
        const coords = thisTile.getCoords(containingSet)
        const surroundingTiles = TileData.getSurroundingTiles(coords, containingSet)

        return function (ctx, x, y) {
            thisTile.plotBackground(ctx, x, y, surroundingTiles)

            if (thisTile.road) {
                thisTile.plotRoad(ctx, x, y, surroundingTiles)
            }

        }
    }

    static getSurroundingTiles(coords: Object, containingSet: Array<Array<TileData>>) {

        function getNearByTile(xd, yd) {
            return containingSet[coords.y + yd] && containingSet[coords.y + yd][coords.x + xd] ? containingSet[coords.y + yd][coords.x + xd] : null
        }

        return [
            [getNearByTile(-1, -1), getNearByTile(0, -1), getNearByTile(1, -1)],
            [getNearByTile(-1, 0), null, getNearByTile(1, 0)],
            [getNearByTile(-1, 1), getNearByTile(0, 1), getNearByTile(1, 1)],
        ]
    }
}

export { TileData, tileColorSchemes }