import React from 'react';

import Tile from './Tile'
import styles from './tile.module.scss'

import {MapSquare, terrainTypes } from '../lib/MapSquare.tsx'


export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  
            // mapSquareMatrix: MapSquare.makeRandomGrid(props.columns, props.rows, .5,.5),
            mapSquareMatrix: MapSquare.makeGridOf(props.columns, props.rows, {terrain: terrainTypes.grass, road:true}),
        };

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(mapSquare) {

        this.setState(state => {
            mapSquare.road = !mapSquare.road
            return state
        })

    }

    getAdjacentSquares(x,y) {
        const {mapSquareMatrix} = this.state
        return {
            below:  mapSquareMatrix[y+1] && mapSquareMatrix[y+1][x] ? mapSquareMatrix[y+1][x] : null,
            above:  mapSquareMatrix[y-1] && mapSquareMatrix[y-1][x] ? mapSquareMatrix[y-1][x] : null,
            before: mapSquareMatrix[y] && mapSquareMatrix[y][x-1] ? mapSquareMatrix[y][x-1] : null,
            after:  mapSquareMatrix[y] && mapSquareMatrix[y][x+1] ? mapSquareMatrix[y][x+1] : null,
        }
    }

    render() {

        const renderTile = mapSquare => { return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
            handleClick = {()=>{this.handleClick(mapSquare)}}
            mapSquare={mapSquare}
            adjacentSquares={this.getAdjacentSquares(mapSquare.x,mapSquare.y)}/> 
        )}

        const renderRow  = (row, y) => {return (
            <div className={styles.row} key={`row ${y}`}>
                {row.map(mapSquare => renderTile(mapSquare))}
            </div>
        )}

        return <section>
            {this.state.mapSquareMatrix.map((row,index) => renderRow(row,index))}
        </section>

    }
}