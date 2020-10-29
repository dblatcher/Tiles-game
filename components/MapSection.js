import React from 'react';

import Tile from './Tile'
import styles from './mapSection.module.scss'
import TownFigure from './TownFigure';

import { spriteSheets } from "../lib/SpriteSheet.tsx"
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

    renderEmptyTile(x, y) {
        return <Tile key={`${x},${y}`} mapSquare={new VoidMapSquare(x, y)} />
    }

    renderTile(mapSquare, excludeCorners) {
        const { handleMapSectionClick, selectedSquare, handleTileHoverEnter, xStart, xSpan, yStart, ySpan, town } = this.props;
        if (mapSquare.x < xStart || mapSquare.x > xStart + xSpan - 1) { return null }

        const isCorner = (mapSquare.x === xStart || mapSquare.x === xStart + xSpan - 1) && (mapSquare.y === yStart || mapSquare.y === yStart + ySpan - 1)

        if (isCorner && excludeCorners) {
            return this.renderEmptyTile(mapSquare.x, mapSquare.y)
        }

        const showYields = mapSquare === town.mapSquare
            || town.citizens.filter(citizen => citizen.mapSquare === mapSquare)[0];

        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={handleMapSectionClick ? () => { handleMapSectionClick(mapSquare) } : null}
                mapSquare={mapSquare}
                isSelected={mapSquare === selectedSquare}
                handleTileHoverEnter={handleTileHoverEnter}
                showYields={showYields}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
            />
        )
    }

    renderEmptyRow(y) {
        const { xStart, xSpan } = this.props
        let emptyTiles = []
        for (let x = xStart; x < xStart + xSpan; x++) {
            emptyTiles.push(this.renderEmptyTile(x, y))
        }
        return (
            <div className={styles.row} key={`row ${y}`}>{emptyTiles}</div>
        )
    }

    renderRow(row, y) {
        const { yStart, ySpan, xStart, xSpan, mapGrid } = this.props
        if (y < yStart || y > yStart + ySpan - 1) { return null }

        let tiles = row.map(mapSquare => this.renderTile(mapSquare, true))
        let emptyTileX

        if (xStart < 0) {
            for (emptyTileX = xStart; emptyTileX < 0; emptyTileX++) {
                tiles.unshift(this.renderEmptyTile(emptyTileX, y))
            }
        }

        if (xStart + xSpan >= mapGrid[y].length) {
            for (emptyTileX = mapGrid[y].length; emptyTileX < xStart + xSpan; emptyTileX++) {
                tiles.push(this.renderEmptyTile(emptyTileX, y))
            }
        }

        return (
            <div className={styles.row} key={`row ${y}`}>{tiles}</div>
        )
    }



    renderCitizen(citizen, index) {
        const { yStart, xStart, handleMapSectionClick } = this.props

        const xPlacement = citizen.mapSquare.x - xStart
        const yPlacement = citizen.mapSquare.y - yStart

        const figureStyle = {
            left: `${xPlacement * 4 * 16}px`,
            top: `${yPlacement * 4 * 16}px`,
        }

        return (
            <figure
                style={figureStyle}
                className={styles.citizenFigure}
                onClick={handleMapSectionClick ? () => { handleMapSectionClick(citizen.mapSquare) } : null}
                key={`citizenIcon-${index}`}>

                <i className={styles.spriteOnMapSection}
                    style={spriteSheets.units.getStyleForFrameCalled('worker')}
                />

            </figure>
        )
    }

    renderTown(town) {
        const { ySpan, xSpan } = this.props;

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

        let citizensOnMap = town.citizens
            .filter(citizen => citizen.mapSquare)
            .map((citizen, index) => this.renderCitizen(citizen, index))

        return (
            <section className={styles.container}>
                <div className={styles.frame}>
                    {emptyRowsAbove}
                    {mapGrid.map((row, index) => this.renderRow(row, index))}
                    {emptyRowsBelow}
                    {this.renderTown(town)}
                    {citizensOnMap}
                </div>
            </section>
        )
    }
}