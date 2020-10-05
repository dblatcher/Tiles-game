import React from 'react'
import { TileData, tileColorSchemes } from '../lib/tileClasses.tsx'
import styles from './tileboard.module.css'

function randomColorSchemeName() {
    const colorSchemeNames = Object.keys(tileColorSchemes)
    const colorIndex = Math.floor(Math.random() * colorSchemeNames.length)
    return colorSchemeNames[colorIndex]
}

function makeTileSet(columns, rows, tileWidth = 100, tileHeight = 100) {
    function makeRow() {
        let row = []
        for (let i = 0; i < columns; i++) {
            row.push(new TileData({
                colorScheme: randomColorSchemeName(),
                tileHeight, tileWidth
            }))
        }
        return row
    }

    let grid = []
    for (let i = 0; i < rows; i++) {
        grid.push(makeRow())
    }
    return grid
}


export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tiles: makeTileSet(props.columns, props.rows, props.tileWidth, props.tileHeight),
            spriteData: [],
        };

        // this.state.tiles[3][3].road = true
        // this.state.tiles[4][3].road = true
        // this.state.tiles[4][3].road = true
        
        // this.state.tiles[2][1].road = true


        this.canvasRef = React.createRef();
        this.imageCanvasRef = React.createRef();
        this.handleTileClick = this.handleTileClick.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        const { clientX, clientY } = event
        const { offsetLeft, offsetTop } = this.canvasRef.current
        const { tileWidth, tileHeight } = this.props
        const {scrollX, scrollY} = window

        let x = Math.floor ( (clientX - offsetLeft + scrollX) / tileWidth  )
        let y = Math.floor ( (clientY - offsetTop + scrollY) / tileHeight  )
        this.handleTileClick(x,y)
    }

    handleTileClick(x, y) {
        this.setState(state => {
           state.tiles[y][x].changeColorScheme(randomColorSchemeName())
            state.tiles[y][x].road = !state.tiles[y][x].road
            this.plotTile(x,y)
            
            return { tiles: state.tiles }
        })
    }

    componentDidMount() {
        this.setUpImageCanvas()
        this.plotAll()
    }

    componentDidUpdate() {
        // this.plotAll()
    }

    setUpImageCanvas() {
        const imageCavas = this.imageCanvasRef.current
        let image = imageCavas.parentElement.querySelector('img')
        const ctx = imageCavas.getContext('2d')
        ctx.drawImage(image,0,0)

        const frameColumns = 3
        const frameRows = 4
        const frameWidth = 20
        const frameHeight = 20

        let imgData, r,c, i
        for ( r =0; r< frameRows; r++) {
            for ( c =0;c< frameColumns; c++) {
                imgData = ctx.getImageData(c*frameWidth, r*frameHeight, frameWidth, frameHeight)
                this.state.spriteData.push(imgData)
            }
        }


    }

    plotTile(x,y) {
        const {tileWidth, tileHeight,rows,columns} = this.props
        const {tiles, spriteData} = this.state
        const ctx = this.canvasRef.current.getContext('2d')

        const tile = tiles[y][x]

        tile.getPlotFunction(tiles)(ctx, x * tileWidth, y * tileHeight, spriteData)

        function plotAdjacentTile(x2,y2) {
            if (!tiles[y2] || !tiles[y2][x2]) {return}
            tiles[y2][x2].getPlotFunction(tiles)(ctx, x2 * tileWidth, y2 * tileHeight, spriteData)
        }

        plotAdjacentTile(x-1,y-1);
        plotAdjacentTile(x,y-1);
        plotAdjacentTile(x+1,y-1);
        plotAdjacentTile(x-1,y);
        plotAdjacentTile(x+1,y);
        plotAdjacentTile(x-1,y+1);
        plotAdjacentTile(x,y+1);
        plotAdjacentTile(x+1,y+1);

    }

    plotAll() {
        const {tileWidth, tileHeight,rows,columns} = this.props
        const {tiles, spriteData} = this.state
        const ctx = this.canvasRef.current.getContext('2d')

        ctx.fillStyle = 'black'
        ctx.fillRect (0,0,columns*tileWidth, rows*tileHeight)

        tiles.forEach((row, index1) => {
            const rowPlotFunctions = row.map(tile => tile.getPlotFunction(tiles))
            rowPlotFunctions.forEach((plotFunc, index2) => {
                plotFunc(ctx, index2 * tileWidth, index1 * tileHeight, spriteData)
            })
        })
    }

    render() {
        const { tileWidth, tileHeight, columns, rows } = this.props

        return (
            <>
                <canvas onClick={this.handleClick}
                    ref={this.canvasRef}
                    width={columns * tileWidth}
                    height={rows * tileHeight}
                ></canvas>
                <img className={styles.sampleImg} src={'spriteSheet.png'}></img>
                <canvas className={styles.sampleImg} ref={this.imageCanvasRef} ></canvas>
            </>
        )
    }


}