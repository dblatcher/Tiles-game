import React from 'react'
import TileBoard from './TileBoard'
import InterfaceWindow from './InterfaceWindow'
import { MapSquare } from '../lib/MapSquare.tsx'
import { terrainTypes } from '../lib/TerrainType.tsx'
import { unitTypes, Unit, factions } from '../lib/Unit.tsx'
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
            units: [
                new Unit(unitTypes.worker, factions[0], { x: 2, y: 3 }),
                new Unit(unitTypes.knight, factions[0], { x: 3, y: 3 }),
                new Unit(unitTypes.knight, factions[1], { x: 3, y: 5 }),
            ],
            selectedUnit: null,
        };

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleUnitFigureClick = this.handleUnitFigureClick.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        this.setState(state => {
            return {
                mapGrid: state.mapGrid,
                selectedSquare: state.selectedSquare === mapSquare ? null : mapSquare
            }
        })
    }

    handleUnitFigureClick(unit) {
        this.setState(state => {
            return {
                units: state.units,
                selectedUnit: state.selectedUnit === unit ? null : unit
            }
        })
    }

    render() {
        const { mapGrid, selectedSquare, units, selectedUnit } = this.state

        return (

            <div className={styles.gameHolder}>
                <article className={styles.tileBoardHolder} >
                    <TileBoard
                        units={units}
                        mapGrid={mapGrid}
                        handleMapSquareClick={this.handleMapSquareClick}
                        handleUnitFigureClick={this.handleUnitFigureClick}
                        selectedSquare={selectedSquare}
                        selectedUnit={selectedUnit} />
                </article>
                <article className={styles.interfaceWindowHolder} >
                    <InterfaceWindow
                     selectedUnit={selectedUnit} 
                     selectedSquare={selectedSquare} />
                </article>
            </div>
        )
    }
}