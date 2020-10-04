import React from 'react'
import { TileData, tileColorSchemes } from '../lib/tileClasses.tsx'


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
        };

        this.state.tiles[3][3].road = true
        this.state.tiles[4][3].road = true
        this.state.tiles[5][3].road = true
        
        this.state.tiles[6][8].road = true


        this.canvasRef = React.createRef();
        this.handleTileClick = this.handleTileClick.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        const { clientX, clientY } = event
        const { offsetLeft, offsetTop } = this.canvasRef.current
        const { tileWidth, tileHeight } = this.props
        let x = Math.floor ( (clientX - offsetLeft) / tileWidth  )
        let y = Math.floor ( (clientY - offsetTop) / tileHeight  )
        this.handleTileClick(x,y)
    }

    handleTileClick(x, y) {
        this.setState(state => {
        //    state.tiles[y][x].changeColorScheme(randomColorSchemeName())
            state.tiles[y][x].road = !state.tiles[y][x].road
            return { tiles: state.tiles }
        })
    }

    componentDidMount() {
        this.plot()
    }

    componentDidUpdate() {
        this.plot()
    }

    plot() {
        const {tileWidth, tileHeight,rows,columns} = this.props
        const {tiles} = this.state

        const ctx = this.canvasRef.current.getContext('2d')

        ctx.fillStyle = 'black'
        ctx.fillRect (0,0,columns*tileWidth, rows*tileHeight)

        tiles.forEach((row, index1) => {
            const rowPlotFunctions = row.map(tile => tile.getPlotFunction(tiles))
            rowPlotFunctions.forEach((plotFunc, index2) => {
                plotFunc(ctx, index2 * tileWidth, index1 * tileHeight)
            })
        })
    }

    render() {
        const { tileWidth, tileHeight, columns, rows } = this.props

        return (
            <canvas onClick={this.handleClick}
                ref={this.canvasRef}
                width={columns * tileWidth}
                height={rows * tileHeight}
            ></canvas>
        )
    }


}