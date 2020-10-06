import React from 'react';

import Tile from './Tile'
import styles from './tile.module.css'

class MapSquare {
    constructor(input,x,y) {
        this.terrain = input.terrain
        this.road = !!input.road

        this.x=x
        this.y=y
    }
}

class TerrainType {
    constructor (name, config = {}) {
        this.name = name
    }
}

const terrainTypes = {
    grass: new TerrainType('grass',{}),
    desert: new TerrainType('desert',{}),
    plain: new TerrainType('plain',{}),
    swamp: new TerrainType('swamp',{}),
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}

function makeMapSquareMatrix(columns, rows) {
    function makeRow(rowIndex) {
        let row = []
        for (let i = 0; i < columns; i++) {
            row.push(new MapSquare({
                terrain: randomTerrainType(),
                road: false
            },i, rowIndex))
        }
        return row
    }

    let grid = []
    for (let i = 0; i < rows; i++) {
        grid.push(makeRow(i))
    }
    return grid
}


export default class TileBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapSquareMatrix: makeMapSquareMatrix(props.columns, props.rows),
            spriteData: [],
        };

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        console.log(event)
    }

    render() {

        const renderTile = mapSquare => {return <Tile mapSquare={mapSquare} key={`${mapSquare.x},${mapSquare.y}`}/> }
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