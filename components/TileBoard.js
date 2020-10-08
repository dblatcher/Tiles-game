import React from 'react';

import Tile from './Tile'
import styles from './tile.module.scss'

import {MapSquare, terrainTypes } from '../lib/MapSquare.tsx'


export default class TileBoard extends React.Component {

    getAdjacentSquares(x,y) {
        const {mapGrid} = this.props
        return {
            below:  mapGrid[y+1] && mapGrid[y+1][x] ? mapGrid[y+1][x] : null,
            above:  mapGrid[y-1] && mapGrid[y-1][x] ? mapGrid[y-1][x] : null,
            before: mapGrid[y] && mapGrid[y][x-1] ? mapGrid[y][x-1] : null,
            after:  mapGrid[y] && mapGrid[y][x+1] ? mapGrid[y][x+1] : null,
        }
    }


    renderTile (mapSquare) { 
        const { handleMapSquareClick, selectedSquare} = this.props;
        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
            handleClick = {()=>{handleMapSquareClick(mapSquare)}}
            mapSquare={mapSquare}
            isSelected={mapSquare === selectedSquare}
            adjacentSquares={this.getAdjacentSquares(mapSquare.x,mapSquare.y)}/> 
        )
    }

    renderRow (row, y) {return (
        <div className={styles.row} key={`row ${y}`}>
            {row.map(mapSquare => this.renderTile(mapSquare))}
        </div>
    )}

    render() {
        const {mapGrid} = this.props
        return (
            <section>
                {mapGrid.map((row,index) => this.renderRow(row,index))}
            </section>
        )
    }
}