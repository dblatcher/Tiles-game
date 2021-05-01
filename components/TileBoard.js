import React from 'react';

import Tile from './Tile'
import UnitFigure from './UnitFigure'
import styles from './tile.module.scss'
import { areSamePlace } from '../lib/utility';


export default class TileBoard extends React.Component {

    get mapGrid() {
        const { mapGrid, stateOfPlay } = this.props
        return mapGrid || stateOfPlay.mapGrid
    }

    get mapGridWidth() {
        return this.mapGrid && this.mapGrid[0] && this.mapGrid[0].length ? this.mapGrid[0].length : 0
    }

    getAdjacentSquares(x, y) {
        const { mapGrid, mapGridWidth } = this
        return {
            below: mapGrid[y + 1] && mapGrid[y + 1][x] ? mapGrid[y + 1][x] : null,
            above: mapGrid[y - 1] && mapGrid[y - 1][x] ? mapGrid[y - 1][x] : null,
            before: mapGrid[y]
                ? (mapGrid[y][x - 1])
                    ? (mapGrid[y][x - 1])
                    : (x == 0 && mapGrid[y][mapGridWidth - 1])
                        ? mapGrid[y][mapGridWidth - 1]
                        : null
                : null,

            after: mapGrid[y]
                ? (mapGrid[y][x + 1])
                    ? (mapGrid[y][x + 1])
                    : (x == mapGridWidth - 1 && mapGrid[y][0])
                        ? mapGrid[y][0]
                        : null
                : null
        }
    }

    getStackedUnits(currentUnit) {
        const { stateOfPlay = {} } = this.props;
        const { units, selectedUnit } = stateOfPlay
        return units
            .filter(unit => currentUnit.x == unit.x && unit.y == currentUnit.y)
            .reverse()
            .sort((a, b) => {
                if (a === selectedUnit) { return -1 }
                if (b === selectedUnit) { return 1 }
                return 0
            })
    }

    renderTile(mapSquare, placesInSight) {
        const {
            stateOfPlay = {}, handleMapSquareClick, infoPage, decorative,
            gameHasOpenDialogue, watchingFaction,
            debug = {}
        } = this.props;

        const { towns = [], units = [], villages=[], selectedSquare, selectedUnit, interfaceMode, isComputerPlayersTurn } = stateOfPlay
        const { mapGrid, mapGridWidth } = this

        const town = towns.find(town => town.mapSquare === mapSquare)
        const village = villages.find(village => village.mapSquare === mapSquare)
        
        const unitsInMapSquare = units.filter(unit => areSamePlace(unit, mapSquare));

        const notInSight = infoPage || decorative
            ? false
            : !placesInSight.some(square => {
                return square.x === mapSquare.x && square.y === mapSquare.y
            })


        const notOnFactionWorldMap = watchingFaction && !infoPage && notInSight
            ? !watchingFaction.worldMap[mapSquare.y] || !watchingFaction.worldMap[mapSquare.y][mapSquare.x]
            : false

        let mapSquareOnFactionWorldMap = null
        if (watchingFaction && !infoPage) {
            if (!notInSight || debug.revealMap) { mapSquareOnFactionWorldMap = mapSquare }
            else if (!notOnFactionWorldMap) { mapSquareOnFactionWorldMap = watchingFaction.worldMap[mapSquare.y][mapSquare.x] }
        }


        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={handleMapSquareClick
                    ? (wasRightClick) => { handleMapSquareClick({ mapSquare, source: 'tile' }, wasRightClick) }
                    : null
                }
                interfaceMode={interfaceMode}
                mapSquare={mapSquare}
                town={town}
                village={village}
                isComputerPlayersTurn={isComputerPlayersTurn}
                unitsInMapSquare={unitsInMapSquare}
                selectedUnit={selectedUnit}
                squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                isSelected={mapSquare === selectedSquare}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
                gameHasOpenDialogue={gameHasOpenDialogue}
                notInSight={notInSight}
                showVoid={notOnFactionWorldMap && !debug.revealMap}
                mapSquareOnFactionWorldMap={mapSquareOnFactionWorldMap}
                showYields={infoPage}
                mapGridWidth={mapGridWidth}
            />
        )
    }

    renderRow(row, y, placesInSight) {
        const { stateOfPlay = {} } = this.props;
        const { mapXOffset = 0 } = stateOfPlay

        const shiftedRow = typeof mapXOffset === 'number'
            ? [].concat(row.slice(mapXOffset), row.slice(0, mapXOffset))
            : row

        return (
            <div className={styles.row} key={`row ${y}`}>
                {shiftedRow.map(mapSquare => this.renderTile(mapSquare, placesInSight))}
            </div>
        )
    }

    renderUnit(unit, placesInSight) {
        const {
            stateOfPlay = {},
            handleMapSquareClick, handleOrderButton,
            debug = {}
        } = this.props;
        const { selectedUnit, mapXOffset = 0, mapShiftInProgress = false, fallenUnits = [], interfaceMode } = stateOfPlay
        const { mapGrid } = this
        const squareUnitIsOn = mapGrid[unit.y][unit.x]

        const notInSight = !placesInSight.some(square => {
            return square.x === unit.x && square.y === unit.y
        })

        return (<UnitFigure
            handleClick={handleMapSquareClick
                ? (wasRightClick) => { handleMapSquareClick({ mapSquare: squareUnitIsOn, source: 'unit'  }, wasRightClick) }
                : null
            }
            squareUnitIsOn={squareUnitIsOn}
            interfaceMode={interfaceMode}
            unit={unit}
            handleOrderButton={handleOrderButton}
            key={"unit#" + unit.indexNumber}
            isSelected={unit === selectedUnit}
            isFallen={fallenUnits && fallenUnits.includes(unit)}
            stack={this.getStackedUnits(unit)}
            gridWidth={mapGrid[0].length}
            notInSight={notInSight && !debug.revealMap}
            mapXOffset={mapXOffset}
            mapShiftInProgress={mapShiftInProgress}
        />)
    }

    render() {
        const { stateOfPlay = {}, watchingFaction } = this.props
        const { units = [], fallenUnits = [], mapZoomLevel = 1 } = stateOfPlay
        const { mapGrid } = this
        const sectionStyle = { fontSize: `${mapZoomLevel * 100}%` }

        const placesInSight = watchingFaction
            ? watchingFaction.placesInSightThisTurn
            : []

        return (
            <section
                className={styles.tileBoard}
                style={sectionStyle}>
                {mapGrid.map((row, index) => this.renderRow(row, index, placesInSight))}
                {[].concat(units, fallenUnits).map(unit => this.renderUnit(unit, placesInSight))}
            </section>
        )
    }
}