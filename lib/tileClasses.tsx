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
    void: new TileColorScheme('#000', '#000'),
}

class TileData {
    colorScheme: TileColorScheme;
    road: Boolean;
    canvasHeight:number;
    canvasWidth:number;
    constructor(colorScheme, options:Object={}) {
        this.colorScheme = tileColorSchemes[colorScheme] || tileColorSchemes.void
        this.road = !!options.road;
        this.canvasHeight = 100;
        this.canvasWidth = 100;
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

    getAllSurroundingTiles(containingSet: Array<Array<TileData>>) {
        const coords = this.getCoords(containingSet)
        if (!coords) return [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]

        function getNearByTile(xd, yd) {
            return containingSet[coords.y + yd] && containingSet[coords.y + yd][coords.x + xd] ? containingSet[coords.y + yd][coords.x + xd] : null
        }

        return [
            [getNearByTile(-1, -1), getNearByTile(0, -1), getNearByTile(1, -1)],
            [getNearByTile(-1, 0), null, getNearByTile(1, 0)],
            [getNearByTile(-1, 1), getNearByTile(0, 1), getNearByTile(1, 1)],
        ]

    }

    changeColorScheme(colorScheme: string) {
        this.colorScheme = tileColorSchemes[colorScheme] || tileColorSchemes.void
    }

    plot(canvas: HTMLCanvasElement, containingSet: Array<Array<TileData>>) {
        const ctx = canvas.getContext('2d');

        TileData.makeGroundPattern(ctx, 0, 0, 100, 100, this.colorScheme)

        if (!containingSet) { return }
        const surrounding = this.getAllSurroundingTiles(containingSet)

        let havePlottedConnectingRoad = false
        surrounding.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                if (!tile) { return }
                const tileX = tileIndex - 1, tileY = rowIndex - 1;
                const isCorner = tileX * tileY !== 0

                const cornerSize = 5
                const sideSize = 5

                ctx.fillStyle = tile.colorScheme.color1;

                if (isCorner) {
                    TileData.makeGroundPattern(
                        ctx,
                        tileX == 1 ? (100 - cornerSize) : 0,
                        tileY == 1 ? (100 - cornerSize) : 0,
                        cornerSize,
                        cornerSize,
                        tile.colorScheme,
                        {dust:true}
                    )
                } else {
                    let sideX, sideY, sideWidth, sideHeight;

                    sideX = tileX == 0
                        ? cornerSize
                        : tileX == -1
                            ? 0 : (100 - sideSize);

                    sideY = tileY == 0
                        ? cornerSize
                        : tileY == -1
                            ? 0 : (100 - sideSize);

                    sideWidth = tileX == 0 ? (100 - 2 * cornerSize) : sideSize;
                    sideHeight = tileY == 0 ? (100 - 2 * cornerSize) : sideSize;


                    TileData.makeGroundPattern(
                        ctx,
                        sideX, sideY, sideWidth, sideHeight,
                        tile.colorScheme,
                        {dust:true}
                    )

                }

                if (this.road && tile.road && !isCorner) {
                    ctx.strokeStyle = "brown";
                    ctx.lineWidth = 5;
                    ctx.moveTo(50, 50);
                    ctx.lineTo(50 + tileX * 60, 50 + tileY * 60);
                    ctx.stroke()
                    havePlottedConnectingRoad = true
                }
            })
        })


        if (this.road && !havePlottedConnectingRoad) {
            ctx.strokeStyle = "brown";
            ctx.lineWidth = 5;
            ctx.moveTo(40, 40);
            ctx.lineTo(60, 60);
            ctx.moveTo(40, 60);
            ctx.lineTo(60, 40);
            ctx.stroke()
        }

    }

    static makeGroundPattern(ctx, x, y, width: number, height: number, colorScheme: TileColorScheme, options:object={}) {

        let imgData = ctx.createImageData(width, height);
        let i;

        const { rgb1, rgb2 } = colorScheme;

        if (rgb1) {
            for (i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = rgb1.r
                imgData.data[i + 1] = rgb1.g
                imgData.data[i + 2] = rgb1.b
                imgData.data[i + 3] = 255
            }
        }

        if (rgb2) {
            for (i = 0; i < imgData.data.length; i += 28) {
                imgData.data[i] = rgb2.r
                imgData.data[i + 1] = rgb2.g
                imgData.data[i + 2] = rgb2.b
                imgData.data[i + 3] = 255
            }
        }

        ctx.putImageData(imgData, x, y)
        return imgData
    }
}

export { TileData }