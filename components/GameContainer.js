import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import { MapSquare } from '../lib/MapSquare.tsx'
import { terrainTypes } from '../lib/TerrainType.tsx'
import styles from './gameContainer.module.css'


export default class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // mapSquareMatrix: MapSquare.makeRandomGrid(props.columns, props.rows, .5,.5),
            // mapSquareMatrix: MapSquare.makeGridOf(props.columns, props.rows, {terrain: terrainTypes.grass, road:true, tree:true}),
            mapGrid: MapSquare.makeGrid(16, 16, function (x, y) {

                const terrain = y > 5
                    ? terrainTypes.swamp
                    : x > 4
                        ? terrainTypes.grass
                        : terrainTypes.plain;

                return new MapSquare({
                    terrain,
                    tree: x > 2 && y % x != 2,
                    road: x == 6 || y == 8,
                }, x, y)
            }),
            selectedSquare: null,
        };

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        this.setState(state => {
            // mapSquare.tree = !mapSquare.tree

            return {
                mapGrid: state.mapGrid,
                selectedSquare: state.selectedSquare === mapSquare ? null : mapSquare
            }
        })
    }

    render() {
        const { mapGrid, selectedSquare } = this.state

        return (

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} >
                    <TileBoard mapGrid={mapGrid} handleMapSquareClick={this.handleMapSquareClick} selectedSquare={selectedSquare} />
                </article>
                <article className={styles.interfaceWindowHolder} >
                    <InterfaceWindow selectedSquare={selectedSquare} />
                </article>
            </div>
        )
    }
}