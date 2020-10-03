class TileData {
    color: string;
    constructor( color:string) {
        this.color = color;
    }

    plot(canvas:HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(10, 10, 80, 80);
    }
}

export { TileData }