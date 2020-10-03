import React from 'react'
import Tile from '../components/Tile'
import styles from './tile.module.css'

import { TileData } from '../lib/tileClasses.tsx'

export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tiles: [
                [
                    new TileData('red'),
                    new TileData('red',true),
                    new TileData('green'),
                    new TileData('blue',true),
                ],
                [
                    new TileData('red',true),
                    new TileData('yellow',true),
                    new TileData('green',true),
                    new TileData('blue'),
                ],
                [
                    new TileData('red',true),
                    new TileData('red'),
                    new TileData('white'),
                    new TileData('blue'),
                ],
                [
                    new TileData('red'),
                    new TileData('blue'),
                    new TileData('green',true),
                    new TileData('blue'),
                ],
            ],
        };

        this.handleTileClick = this.handleTileClick.bind(this)
    }

    handleTileClick(x, y) {
        this.setState(state => {
            state.tiles[y][x].color = state.tiles[y][x].color == 'black' ? 'white' : 'black';
            return {tiles: state.tiles}
        })
    }

    renderTile(x, y) {
        const {tiles} = this.state
        return <Tile
            clickHandler={() => { this.handleTileClick(x, y) }}
            tileData={tiles[y][x]}
            containingSet = {tiles}
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