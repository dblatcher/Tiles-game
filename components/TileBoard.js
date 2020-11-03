import React from 'react';

import Tile from './Tile'
import UnitFigure from './UnitFigure'
import styles from './tile.module.scss'



export default class TileBoard extends React.Component {

    getAdjacentSquares(x, y) {
        const { mapGrid } = this.props
        return {
            below: mapGrid[y + 1] && mapGrid[y + 1][x] ? mapGrid[y + 1][x] : null,
            above: mapGrid[y - 1] && mapGrid[y - 1][x] ? mapGrid[y - 1][x] : null,
            before: mapGrid[y] && mapGrid[y][x - 1] ? mapGrid[y][x - 1] : null,
            after: mapGrid[y] && mapGrid[y][x + 1] ? mapGrid[y][x + 1] : null,
        }
    }

    getStackedUnits(currentUnit) {
        const { units, selectedUnit } = this.props
        return units
            .filter(unit => currentUnit.x == unit.x && unit.y == currentUnit.y)
            .reverse()
            .sort((a, b) => {
                if (a === selectedUnit) { return -1 }
                if (b === selectedUnit) { return 1 }
                return 0
            })
    }

    renderTile(mapSquare) {
        const { handleMapSquareClick, selectedSquare, selectedUnit, handleTileHoverEnter, mapGrid, interfaceMode, gameHasOpenDialogue, towns } = this.props;
        
        const town = towns.filter(town => town.mapSquare === mapSquare)[0]

        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={() => { handleMapSquareClick({mapSquare, source:'tile'}) }}
                interfaceMode={interfaceMode}
                mapSquare={mapSquare}
                town={town}
                selectedUnit={selectedUnit}
                squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                isSelected={mapSquare === selectedSquare}
                handleTileHoverEnter={handleTileHoverEnter}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
                gameHasOpenDialogue={gameHasOpenDialogue}
            />
        )
    }

    renderRow(row, y) {
        return (
            <div className={styles.row} key={`row ${y}`}>
                {row.map(mapSquare => this.renderTile(mapSquare))}
            </div>
        )
    }

    renderUnit(unit) {
        const { handleMapSquareClick, selectedUnit, fallenUnits, mapGrid, unitWithMenuOpen, handleOrderButton, interfaceMode } = this.props;

        const squareUnitIsOn = mapGrid[unit.y][unit.x]

        return (<UnitFigure
            handleClick={() => { 
                handleMapSquareClick({mapSquare:squareUnitIsOn, source:'unit'}) 
            }}
            squareUnitIsOn={squareUnitIsOn}
            interfaceMode={interfaceMode}
            unit={unit}
            handleOrderButton={handleOrderButton}
            menuIsOpen={unit === unitWithMenuOpen}
            key={"unit#" + unit.indexNumber}
            isSelected={unit === selectedUnit}
            isFallen={fallenUnits && fallenUnits.includes(unit)}
            stack={this.getStackedUnits(unit)}
            gridWidth={mapGrid[0].length}
        />)
    }

    render() {
        const { mapGrid, units=[], fallenUnits=[], towns=[], mapZoomLevel=1 } = this.props
        const sectionStyle = { fontSize: `${mapZoomLevel*100}%` }

        return (
            <section 
            className={styles.tileBoard} 
            style={sectionStyle}>
                {mapGrid.map((row, index) => this.renderRow(row, index))}
                {[].concat(units, fallenUnits).map(unit => this.renderUnit(unit))}
            </section>
        )
    }
}