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
        const { handleMapSquareClick, selectedSquare, selectedUnit, handleTileHoverEnter, mapGrid, interfaceMode } = this.props;
        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={() => { handleMapSquareClick(mapSquare) }}
                interfaceMode={interfaceMode}
                mapSquare={mapSquare}
                selectedUnit={selectedUnit}
                squareSelectedUnitIsIn = {selectedUnit ?  mapGrid[selectedUnit.y][selectedUnit.x] : null}
                isSelected={mapSquare === selectedSquare}
                handleTileHoverEnter={handleTileHoverEnter}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
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

    renderUnit(unit, index) {
        const { handleUnitFigureClick, selectedUnit } = this.props;
        return (<UnitFigure
            handleClick={() => { handleUnitFigureClick(unit) }}
            unit={unit}
            key={"unit#" + index}
            isSelected={unit === selectedUnit}
            stack={this.getStackedUnits(unit)}
        />)
    }

    render() {
        const { mapGrid, units } = this.props
        return (
            <section style={{ position: 'relative' }}>
                {mapGrid.map((row, index) => this.renderRow(row, index))}
                {units.map((unit, index) => this.renderUnit(unit, index))}
            </section>
        )
    }
}