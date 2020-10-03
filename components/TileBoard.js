import React from 'react'
import Tile from '../components/Tile'

import { TileData } from '../lib/tileClasses.tsx'

export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tiles: [
                [
                    new TileData('red'),
                    new TileData('red'),
                    new TileData('green'),
                    new TileData('blue'),
                ],
                [
                    new TileData('red'),
                    new TileData('red'),
                    new TileData('green'),
                    new TileData('blue'),
                ],
                [
                    new TileData('red'),
                    new TileData('red'),
                    new TileData('green'),
                    new TileData('blue'),
                ],
                [
                    new TileData('red'),
                    new TileData('blue'),
                    new TileData('green'),
                    new TileData('blue'),
                ],
            ],
        };

        this.handleTileClick = this.handleTileClick.bind(this)
    }

    handleTileClick(x, y) {
        console.log('click', x, y)
        this.setState(state => {
            state.tiles[y][x].color = 'black'
            return {tiles: state.tiles}
        })
    }

    renderTile(x, y) {
        return <Tile
            clickHandler={() => { this.handleTileClick(x, y) }}
            tileData={this.state.tiles[y][x]}
            key={`${x},${y}`} />;
    }
    renderTileRow(y) {
        return this.state.tiles[y].map((tile, index) => this.renderTile(index, y))
    }

    render() {

        return this.state.tiles.map((row, index) => {
            return (
                <div key={index}>
                    {this.renderTileRow(index)}
                </div>
            )
        })
    }
}