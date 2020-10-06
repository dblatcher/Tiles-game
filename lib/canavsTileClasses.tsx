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
    backgroundImgData: object;
    constructor(color1: string, color2: string) {
        this.color1 = color1;
        this.color2 = color2;
        this.backgroundImgData = {};
    }

    get rgb1() { return hexToRgb(this.color1) }
    get rgb2() { return hexToRgb(this.color2) }

    getBackgroundImageData(ctx, tileWidth, tileHeight) {

        const dimKey = `Background ${tileWidth}x${tileHeight}`

        if (this.backgroundImgData[dimKey]) { return this.backgroundImgData[dimKey] }
        let imgData = ctx.createImageData(tileWidth, tileHeight);
        let i;
        const dotInterval =  Math.floor( 5.5 + tileWidth/3.215)

        for (i = 0; i < imgData.data.length; i += 4) {

            if (i % (dotInterval * 4) == 0) {
                imgData.data[i + 0] = this.rgb2.r;
                imgData.data[i + 1] = this.rgb2.g;
                imgData.data[i + 2] = this.rgb2.b;
                imgData.data[i + 3] = 255;
            } else {
                imgData.data[i + 0] = this.rgb1.r;
                imgData.data[i + 1] = this.rgb1.g;
                imgData.data[i + 2] = this.rgb1.b;
                imgData.data[i + 3] = 255;
            }
        }

        this.backgroundImgData[dimKey] = imgData
        return imgData

    }

    getEdgeImageData(ctx, tileWidth, tileHeight, otherColor, vertical = false) {

        const dimKey = `HorizontalEdge-${vertical ? 'vertical' : 'horizontal'}-${otherColor.toString()} ${tileWidth}x${tileHeight}`
        if (this.backgroundImgData[dimKey]) { return this.backgroundImgData[dimKey] }

        const otherRgb = hexToRgb(otherColor)

        let imgData = ctx.createImageData(tileWidth / (vertical ? 1 : 20), tileHeight / (vertical ? 20 : 1));
        let i;
        const dotInterval = 2

        for (i = 0; i < imgData.data.length; i += 4) {

            if (i % (dotInterval * 4) == 0) {
                imgData.data[i + 0] = otherRgb.r;
                imgData.data[i + 1] = otherRgb.g;
                imgData.data[i + 2] = otherRgb.b;
                imgData.data[i + 3] = 255;
            } else {
                imgData.data[i + 0] = this.rgb1.r;
                imgData.data[i + 1] = this.rgb1.g;
                imgData.data[i + 2] = this.rgb1.b;
                imgData.data[i + 3] = 255;
            }
        }

        this.backgroundImgData[dimKey] = imgData
        return imgData

    }

}

const tileColorSchemes = {

    // red: new TileColorScheme('#F00', 'A00'),
    // blue: new TileColorScheme('#00F', '00A'),

    desert: new TileColorScheme('#ea5', '#661'),
    grass: new TileColorScheme('#6b5', '#ea5'),
    ice: new TileColorScheme('#fff', '#88f'),
    tundra: new TileColorScheme('#999', '#0d9'),
    void: new TileColorScheme('#000', '#FFF'),
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


        const imgData = colorScheme.getBackgroundImageData(ctx, tileWidth, tileWidth)
        ctx.putImageData(imgData, x, y)

        const tileToLeft = surroundingTiles[1][0]
        const tileToRight = surroundingTiles[1][2]
        const tileAbove = surroundingTiles[0][1]
        const tileBelow = surroundingTiles[2][1]
        let edgeImg
        if (tileToLeft && tileToLeft.colorScheme != this.colorScheme) {
            edgeImg = this.colorScheme.getEdgeImageData(ctx, tileWidth, tileWidth, tileToLeft.colorScheme.color1)
            ctx.putImageData(edgeImg, x, y)
        }
        if (tileAbove && tileAbove.colorScheme != this.colorScheme) {
            edgeImg = this.colorScheme.getEdgeImageData(ctx, tileWidth, tileWidth, tileAbove.colorScheme.color1, true)
            ctx.putImageData(edgeImg, x, y)
        }
        if (tileToRight && tileToRight.colorScheme != this.colorScheme) {
            edgeImg = this.colorScheme.getEdgeImageData(ctx, tileWidth, tileWidth, tileToRight.colorScheme.color1)
            ctx.putImageData(edgeImg, x + tileWidth - edgeImg.width, y)
        }
        if (tileBelow && tileBelow.colorScheme != this.colorScheme) {
            edgeImg = this.colorScheme.getEdgeImageData(ctx, tileWidth, tileWidth, tileBelow.colorScheme.color1, true)
            ctx.putImageData(edgeImg, x, y + tileHeight - edgeImg.height)
        }

    }

    plotSprite (ctx, x: number, y: number, sprite) {
        const spriteWidth = 20
        const spriteHeight = 20
        let copy = ctx.getImageData(x, y, this.tileWidth, this.tileHeight)
        let spritePixel, index

        const xOffset = (this.tileWidth - spriteWidth) / 2
        const yOffset = (this.tileHeight - spriteHeight) / 2

        for (let r = 0; r < spriteHeight; r++) {
            for (let c = 0; c < spriteWidth; c++) {

                index = (r * spriteWidth * 4) + c * 4
                spritePixel = {
                    r: sprite.data[index],
                    g: sprite.data[index + 1],
                    b: sprite.data[index + 2],
                    a: sprite.data[index + 3],
                }
                if (spritePixel.a == 0) { continue }

                let correspondingIndex = 4 * ( (r + yOffset) * this.tileWidth  + c + xOffset)

                copy.data[correspondingIndex] = spritePixel.r;
                copy.data[correspondingIndex + 1] = spritePixel.g;
                copy.data[correspondingIndex + 2] = spritePixel.b;
            }
        }
        ctx.putImageData(copy, x, y)
    }

    getPlotFunction(containingSet: Array<Array<TileData>>) {
        const thisTile = this;
        const coords = thisTile.getCoords(containingSet)
        const surroundingTiles = TileData.getSurroundingTiles(coords, containingSet)

        return function (ctx, x, y, spriteData) {

            thisTile.plotBackground(ctx, x, y, surroundingTiles)

            if (thisTile.road) {
                thisTile.plotRoad(ctx, x, y, surroundingTiles)
            }

            const sprite = spriteData[11]
            thisTile.plotSprite(ctx,x,y,sprite)

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