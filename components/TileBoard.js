import React from 'react'
import Tile from '../components/Tile'
import styles from './tile.module.css'

import { TileData, tileColorSchemes } from '../lib/tileClasses.tsx'


function randomColorSchemeName() {
    const colorSchemeNames = Object.keys(tileColorSchemes)
    const colorIndex = Math.floor(Math.random() * colorSchemeNames.length)
    return colorSchemeNames[colorIndex]
}

function makeTileSet(w,h) {
    function makeRow() {
        let row = []
        for (let i = 0; i<w; i++) {
            row.push (new TileData({
                colorScheme: randomColorSchemeName(),
                canvasWidth: 50,
                canvasHeight: 50,

            }))
        }
        return row
    }

    let grid = []
    for (let i = 0; i<h; i++) {
        grid.push(makeRow())
    }
    return grid
}


export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tiles: makeTileSet(6,120),
        };

        this.handleTileClick = this.handleTileClick.bind(this)
    }

    handleTileClick(x, y) {
        this.setState(state => {
            state.tiles[y][x].changeColorScheme(randomColorSchemeName())
            state.tiles[y][x].road = !state.tiles[y][x].road
            return { tiles: state.tiles }
        })
    }

    renderTile(x, y) {
        const { tiles } = this.state
        return <Tile
            clickHandler={() => { this.handleTileClick(x, y) }}
            tileData={tiles[y][x]}
            surroundings = {TileData.getSurroundingTiles(x,y,tiles)}
            key={`${x},${y}`} />;
    }

    renderTileRow(y) {
        return this.state.tiles[y].map((tile, index) => this.renderTile(index, y))
    }

    render() {

        return this.state.tiles.map((row, index) => {
            return (
                <div key={index} className={styles.row}>
                    {this.renderTileRow(index)}
                </div>
            )
        })
    }
}