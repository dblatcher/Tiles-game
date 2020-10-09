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
            activeFaction: factions[0],
        };

        this.handleMapSquareClick = this.handleMapSquareClick.bind(this)
        this.handleUnitFigureClick = this.handleUnitFigureClick.bind(this)
        this.handleEndOfTurn = this.handleEndOfTurn.bind(this)
    }


    handleMapSquareClick(mapSquare) {
        this.setState(state => {
            if (state.selectedUnit && state.selectedUnit.faction === state.activeFaction ) {
                state.selectedUnit.attemptMoveTo(mapSquare)
            }
            return state;
        })
    }

    handleUnitFigureClick(unit) {
        this.setState(state => {
            if (unit === state.selectedUnit) {
                state.selectedUnit = null
            } else {
                if (unit.faction === state.activeFaction) {
                    state.selectedUnit = unit
                }
            }
            return state
        })
    }

    handleEndOfTurn() {
        this.setState( state =>{

            state.units.forEach(unit => {
                if (unit.faction === state.activeFaction) {
                    unit.refresh()
                }
            })
            const activeFactionIndex = factions.indexOf(state.activeFaction)
            state.activeFaction = factions[activeFactionIndex+1] || factions[0]
            state.selectedUnit = state.units.filter(unit => unit.faction === state.activeFaction)[0] || null

            return state
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
                        selectedSquare={selectedSquare} 
                        handleEndOfTurn={this.handleEndOfTurn}/>
                </article>
            </div>
        )
    }
}