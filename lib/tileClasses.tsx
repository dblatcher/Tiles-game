class TileData {
    color: string;
    road: Boolean;
    constructor(color: string, road: Boolean = false) {
        this.color = color;
        this.road = road;
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

    getSurroundingTiles(containingSet: Array<Array<TileData>>) {
        const coords = this.getCoords(containingSet)
        if (!coords) return { tileBelow: null, tileAbove: null, tileBefore: null, tileAfter: null }
        return {
            tileBelow: containingSet[coords.y + 1] && containingSet[coords.y + 1][coords.x] ? containingSet[coords.y + 1][coords.x] : null,
            tileAbove: containingSet[coords.y - 1] && containingSet[coords.y - 1][coords.x] ? containingSet[coords.y - 1][coords.x] : null,
            tileBefore: containingSet[coords.y][coords.x - 1] ? containingSet[coords.y][coords.x - 1] : null,
            tileAfter: containingSet[coords.y][coords.x + 1] ? containingSet[coords.y][coords.x + 1] : null,
        }
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


    plot(canvas: HTMLCanvasElement, containingSet: Array<Array<TileData>>) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, 100, 100);

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

                ctx.fillStyle = tile.color;

                if (isCorner) {
                    ctx.fillRect(tileX == 1 ? (100 - cornerSize) : 0, tileY == 1 ? (100 - cornerSize) : 0, cornerSize, cornerSize);
                } else {
                    let sideX, sideY, sideWidth, sideHeight;

                    sideX = tileX == 0
                        ? cornerSize
                        : tileX == -1
                            ? 0 : (100-sideSize);

                    sideY = tileY == 0
                        ? cornerSize
                        : tileY == -1
                            ? 0 : (100-sideSize);

                    sideWidth =  tileX == 0 ? (100 - 2*cornerSize) : sideSize;
                    sideHeight =  tileY == 0 ? (100 - 2*cornerSize) : sideSize;

                    ctx.fillRect(sideX, sideY, sideWidth, sideHeight);
                }

                if (this.road && tile.road) {
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
}

export { TileData }