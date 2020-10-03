class TileData {
    color: string;
    constructor( color:string) {
        this.color = color;
    }

    getCoords(containingSet:Array<Array<TileData>>) {
        if (!containingSet) {return null}
        let row,index;

        for (row =0; row<containingSet.length; row++) {
            index = containingSet[row].indexOf(this)
            if (index !== -1) {
                return {x:index,y:row}
            }
        }
        return null
    }

    getSurroundingTiles(containingSet:Array<Array<TileData>>) {
        const coords = this.getCoords(containingSet)
        if (!coords) return null
        return {
            tileBelow: containingSet[coords.y+1] && containingSet[coords.y+1][coords.x] ? containingSet[coords.y+1][coords.x] : null,
            tileAbove: containingSet[coords.y-1] && containingSet[coords.y-1][coords.x] ? containingSet[coords.y-1][coords.x] : null,
            tileBefore: containingSet[coords.y][coords.x-1] ? containingSet[coords.y][coords.x-1] : null,
            tileAfter: containingSet[coords.y][coords.x+1] ? containingSet[coords.y][coords.x+1] : null,
        }
    }

    plot(canvas:HTMLCanvasElement, containingSet:Array<Array<TileData>>) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, 100, 100);

        if (containingSet) {
            const coords = this.getCoords(containingSet)
            if (!coords) return
            const surroundingTiles = this.getSurroundingTiles(containingSet)

            const {tileBelow,tileAbove,tileBefore,tileAfter} = surroundingTiles

            if (tileBelow) {
                ctx.fillStyle = tileBelow.color;
                ctx.fillRect(10, 90, 80, 10);
            }

            if (tileAbove) {
                ctx.fillStyle = tileAbove.color;
                ctx.fillRect(10, 0, 80, 10);
            }

            if (tileBefore) {
                ctx.fillStyle = tileBefore.color;
                ctx.fillRect(0, 10, 10, 80);
            }

            if (tileAfter) {
                ctx.fillStyle = tileAfter.color;
                ctx.fillRect(90, 10, 10, 80);
            }
        }
    }
}

export { TileData }