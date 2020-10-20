import React from 'react';

import Tile from './Tile'
import styles from './tile.module.scss'
import TownFigure from './TownFigure';

import VoidMapSquare from "../lib/VoidMapSquare.tsx";

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


    renderTile(mapSquare) {
        const { handleMapSquareClick, selectedSquare, handleTileHoverEnter, xStart, xSpan } = this.props;
        if (mapSquare.x < xStart || mapSquare.x > xStart + xSpan - 1) { return null }

        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={handleMapSquareClick ? () => { handleMapSquareClick(mapSquare) } : null}
                mapSquare={mapSquare}
                isSelected={mapSquare === selectedSquare}
                handleTileHoverEnter={handleTileHoverEnter}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
            />
        )
    }

    renderEmptyRow(y) {
        const { xStart, xSpan } = this.props
        let emptyTiles = []
        for (let x = xStart; x < xStart + xSpan; x++) {
            emptyTiles.push(<Tile key={`${x},${y}`} mapSquare={new VoidMapSquare(x, y)} />)
        }
        return (
            <div className={styles.row} key={`row ${y}`}>{emptyTiles}</div>
        )
    }

    renderRow(row, y) {
        const { yStart, ySpan, xStart, xSpan, mapGrid } = this.props
        if (y < yStart || y > yStart + ySpan - 1) { return null }

        let tiles = row.map(mapSquare => this.renderTile(mapSquare))
        let emptyTileX

        if (xStart < 0) {
            for (emptyTileX = xStart; emptyTileX < 0; emptyTileX++) {
                tiles.unshift(<Tile key={`${emptyTileX},${y}`} mapSquare={new VoidMapSquare(emptyTileX, y)} />)
            }
        }

        if (xStart + xSpan >= mapGrid[y].length) {
            for (emptyTileX = mapGrid[y].length; emptyTileX < xStart + xSpan; emptyTileX++) {
                tiles.push(<Tile key={`${emptyTileX},${y}`} mapSquare={new VoidMapSquare(emptyTileX, y)} />)
            }
        }

        return (
            <div className={styles.row} key={`row ${y}`}>{tiles}</div>
        )
    }



    renderTown(town) {
        const { handleMapSquareClick, ySpan, xSpan } = this.props;

        return (
            <TownFigure town={town}
                onMapSection
                xPlacement={(xSpan - 1) / 2}
                yPlacement={(ySpan - 1) / 2}
                key={"town#" + town.indexNumber}
            />
        )
    }

    render() {
        const { mapGrid, town, yStart, ySpan } = this.props
        let emptyRowY

        let emptyRowsAbove = []
        if (yStart < 0) {
            for (emptyRowY = yStart; emptyRowY < 0; emptyRowY++) {
                emptyRowsAbove.push(this.renderEmptyRow(emptyRowY))
            }
        }

        let emptyRowsBelow = []
        if (yStart + ySpan >= mapGrid.length) {
            for (emptyRowY = mapGrid.length; emptyRowY < yStart + ySpan; emptyRowY++) {
                emptyRowsBelow.push(this.renderEmptyRow(emptyRowY))
            }
        }

        return (
            <section style={{ position: 'relative' }}>

                {emptyRowsAbove}
                {mapGrid.map((row, index) => this.renderRow(row, index))}
                {emptyRowsBelow}

                {this.renderTown(town)}
            </section>
        )
    }
}