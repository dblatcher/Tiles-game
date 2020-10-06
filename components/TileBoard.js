import React from 'react';

import Tile from './Tile'
import styles from './tile.module.scss'

class MapSquare {
    constructor(input,x,y) {
        this.terrain = input.terrain
        this.road = !!input.road
        this.tree = !!input.tree

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

function makeMapSquareMatrix(columns, rows, treeChance) {
    function makeRow(rowIndex) {
        let row = []
        for (let i = 0; i < columns; i++) {
            row.push(new MapSquare({
                terrain: randomTerrainType(),
                road: false,
                tree: Math.random() < treeChance
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
            mapSquareMatrix: makeMapSquareMatrix(props.columns, props.rows,.8),
            spriteData: [],
        };

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(mapSquare) {

        this.setState(state => {
            mapSquare.tree = !mapSquare.tree
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