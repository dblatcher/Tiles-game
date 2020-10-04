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
    canvasHeight: number;
    canvasWidth: number;
    constructor(options: Object = {}) {
        this.colorScheme = tileColorSchemes[options.colorScheme] || tileColorSchemes.void
        this.road = !!options.road;
        this.canvasHeight = options.canvasHeight || 100;
        this.canvasWidth = options.canvasWidth || 100;
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

    plotGround(ctx, x, y, width: number, height: number, colorScheme: TileColorScheme) {
        ctx.fillStyle = colorScheme.color1
        ctx.fillRect(x, y, width, height)

        ctx.fillStyle = colorScheme.color2
        ctx.fillRect(x + width * (3 / 8), y + height * (3 / 8), width * (1 / 4), height * (1 / 4))
    }

    plot(canvas: HTMLCanvasElement, surrounding: Array<Array<TileData>>) {
        const ctx = canvas.getContext('2d');
        const { canvasHeight, canvasWidth, colorScheme } = this;
        this.plotGround(ctx, 0, 0, canvasWidth, canvasHeight, colorScheme)
        let roadWidth = canvasWidth / 20
        let havePlottedConnectingRoad = false


        surrounding.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                if (!tile) { return }
                const tileX = tileIndex - 1, tileY = rowIndex - 1;
                const isCorner = tileX * tileY !== 0

                const cornerSize = 5
                const sideSize = 5


                if (isCorner) {
                    this.plotGround(
                        ctx,
                        tileX == 1 ? (canvasWidth - cornerSize) : 0,
                        tileY == 1 ? (canvasHeight - cornerSize) : 0,
                        cornerSize,
                        cornerSize,
                        tile.colorScheme,
                    )
                } else {
                    let sideX, sideY, sideWidth, sideHeight;

                    sideX = tileX == 0
                        ? cornerSize
                        : tileX == -1
                            ? 0 : (canvasWidth - sideSize);

                    sideY = tileY == 0
                        ? cornerSize
                        : tileY == -1
                            ? 0 : (canvasHeight - sideSize);

                    sideWidth = tileX == 0 ? (canvasWidth - 2 * cornerSize) : sideSize;
                    sideHeight = tileY == 0 ? (canvasHeight - 2 * cornerSize) : sideSize;


                    this.plotGround(
                        ctx,
                        sideX, sideY, sideWidth, sideHeight,
                        tile.colorScheme
                    )

                }

                if (this.road && tile.road && !isCorner) {
                    ctx.strokeStyle = "brown";
                    ctx.lineWidth = roadWidth;
                    ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
                    ctx.lineTo((canvasWidth / 2) + (tileX * canvasWidth / 2), (canvasHeight / 2) + (tileY * canvasHeight / 2));
                    ctx.stroke()
                    havePlottedConnectingRoad = true
                }
            })
        })


        if (this.road && !havePlottedConnectingRoad) {
            console.log('drawing x', havePlottedConnectingRoad)
            ctx.strokeStyle = "brown";
            ctx.lineWidth = roadWidth;
            ctx.moveTo((canvasWidth / 2)-roadWidth*5, (canvasHeight / 2)-roadWidth*5);
            ctx.lineTo((canvasWidth / 2)+roadWidth*5, (canvasHeight / 2)+roadWidth*5);
            ctx.moveTo((canvasWidth / 2)-roadWidth*5, (canvasHeight / 2)+roadWidth*5);
            ctx.lineTo((canvasWidth / 2)+roadWidth*5, (canvasHeight / 2)-roadWidth*5);
            ctx.stroke()
        }

    }

    static getSurroundingTiles(x: number, y: number, containingSet: Array<Array<TileData>>) {
        const coords = { x, y }

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