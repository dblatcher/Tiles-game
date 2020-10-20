import React from 'react';

import Tile from './Tile'
import styles from './tile.module.scss'
import TownFigure from './TownFigure';



export default class MapSection extends React.Component {

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
        const { handleMapSquareClick, selectedSquare, handleTileHoverEnter, xStart, yStart } = this.props;
        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={() => { handleMapSquareClick(mapSquare) }}
                mapSquare={mapSquare}
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



    renderTown (town) {
        const { handleMapSquareClick, mapGrid } = this.props;
        const squaretownIsOn = mapGrid[town.y][town.x]

        return (
            <TownFigure town={town}
            key={"town#" + town.indexNumber}
            handleClick={() => {handleMapSquareClick(squaretownIsOn)}}/>
        )
    }

    render() {
        const { mapGrid, town} = this.props
        return (
            <section style={{ position: 'relative' }}>
                {mapGrid.map((row, index) => this.renderRow(row, index))}
                {this.renderTown(town)}
            </section>
        )
    }
}