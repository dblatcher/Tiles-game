import React from 'react'
import TileBoard from './TileBoard'
import {MapSquare, terrainTypes } from '../lib/MapSquare.tsx'

export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  
            // mapSquareMatrix: MapSquare.makeRandomGrid(props.columns, props.rows, .5,.5),
            // mapSquareMatrix: MapSquare.makeGridOf(props.columns, props.rows, {terrain: terrainTypes.grass, road:true, tree:true}),
            mapGrid: MapSquare.makeGrid(8,8, function(x,y) {
                return new MapSquare({
                    terrain: y > 3 ? terrainTypes.desert : terrainTypes.grass,
                    tree: x > 2 && y%x != 2, 
                },x,y)
            }),
        };

       this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        this.setState(state => {
            mapSquare.tree = !mapSquare.tree
            return {mapGrid: state.mapGrid}
        })
    }

    render() {
        const {mapGrid} = this.state

        return (
            <TileBoard mapGrid={mapGrid} handleMapSquareClick={this.handleMapSquareClick}/>
        )

    }

}