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

    plot(canvas: HTMLCanvasElement, containingSet: Array<Array<TileData>>) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, 100, 100);

        if (!containingSet) { return }
        const { tileBelow, tileAbove, tileBefore, tileAfter } = this.getSurroundingTiles(containingSet)
        let havePlottedConnectingRoad = false

        if (tileBelow) {
            ctx.fillStyle = tileBelow.color;
            ctx.fillRect(10, 90, 80, 10);

            if (this.road && tileBelow.road) {
                ctx.fillStyle = "brown";
                ctx.lineWidth = 5;
                ctx.moveTo(50,50);
                ctx.lineTo(50,100);
                ctx.stroke()
                havePlottedConnectingRoad=true
            }
        }

        if (tileAbove) {
            ctx.fillStyle = tileAbove.color;
            ctx.fillRect(10, 0, 80, 10);

            if (this.road && tileAbove.road) {
                ctx.fillStyle = "brown";
                ctx.lineWidth = 5;
                ctx.moveTo(50,50);
                ctx.lineTo(50,0);
                ctx.stroke()
                havePlottedConnectingRoad=true
            }
        }

        if (tileBefore) {
            ctx.fillStyle = tileBefore.color;
            ctx.fillRect(0, 10, 10, 80);

            if (this.road && tileBefore.road) {
                ctx.fillStyle = "brown";
                ctx.lineWidth = 5;
                ctx.moveTo(50,50);
                ctx.lineTo(0,50);
                ctx.stroke()
                havePlottedConnectingRoad=true
            }
        }

        if (tileAfter) {
            ctx.fillStyle = tileAfter.color;
            ctx.fillRect(90, 10, 10, 80);

            if (this.road && tileAfter.road) {
                ctx.fillStyle = "brown";
                ctx.lineWidth = 5;
                ctx.moveTo(50,50);
                ctx.lineTo(100,50);
                ctx.stroke()
                havePlottedConnectingRoad=true
            }
        }

        if (this.road && !havePlottedConnectingRoad) {
            ctx.fillStyle = "brown";
            ctx.lineWidth = 5;
            ctx.moveTo(40,40);
            ctx.lineTo(60,60);
            ctx.moveTo(40,60);
            ctx.lineTo(60,40);
            ctx.stroke()
        }

    }
}

export { TileData }