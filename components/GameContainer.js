import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import {MapSquare, terrainTypes } from '../lib/MapSquare.tsx'
import styles from './gameContainer.module.css'


export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  
            // mapSquareMatrix: MapSquare.makeRandomGrid(props.columns, props.rows, .5,.5),
            // mapSquareMatrix: MapSquare.makeGridOf(props.columns, props.rows, {terrain: terrainTypes.grass, road:true, tree:true}),
            mapGrid: MapSquare.makeGrid(16,16, function(x,y) {
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

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} >
                    <TileBoard mapGrid={mapGrid} handleMapSquareClick={this.handleMapSquareClick}/>
                </article>
                <article className={styles.interfaceWindowHolder} >
                    <InterfaceWindow/>
                </article>
            </div>
        )
    }
}