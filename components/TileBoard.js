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


    renderTile(mapSquare) {
        const { handleMapSquareClick, selectedSquare, selectedUnit } = this.props;
        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={() => { handleMapSquareClick(mapSquare) }}
                mapSquare={mapSquare}
                selectedUnit={selectedUnit}
                isSelected={mapSquare === selectedSquare}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)} />
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