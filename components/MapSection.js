import React from 'react';

import Tile from './Tile'
import styles from './mapSection.module.scss'
import VoidMapSquare from "../lib/game-entities/VoidMapSquare";
import { areSamePlace } from '../lib/utility';


export default class MapSection extends React.Component {

    getAdjacentSquares(x, y) {
        const { mapGrid } = this.props.stateOfPlay
        return {
            below: mapGrid[y + 1] && mapGrid[y + 1][x] ? mapGrid[y + 1][x] : null,
            above: mapGrid[y - 1] && mapGrid[y - 1][x] ? mapGrid[y - 1][x] : null,
            before: mapGrid[y] && mapGrid[y][x - 1] ? mapGrid[y][x - 1] : null,
            after: mapGrid[y] && mapGrid[y][x + 1] ? mapGrid[y][x + 1] : null,
        }
    }

    get xStart() {
        return this.props.town.x - 2
    }
    get yStart() {
        return this.props.town.y - 2
    }
    get span() {
        return (this.props.radius * 2) + 1
    }

    renderEmptyTile(x, y) {
        return <Tile key={`${x},${y}`} mapSquare={new VoidMapSquare(x, y)} />
    }

    renderTile(mapSquare, excludeCorners, occupier) {
        const { handleMapSectionClick, town, stateOfPlay } = this.props;
        const { units, selectedSquare } = stateOfPlay
        const { span, xStart, yStart, } = this

        if (mapSquare.x < xStart || mapSquare.x > xStart + span - 1) { return null }

        const isCorner = (mapSquare.x === xStart || mapSquare.x === xStart + span - 1) && (mapSquare.y === yStart || mapSquare.y === yStart + span - 1)
        const isTownTile = town.mapSquare === mapSquare
        const citizen = town.citizens.filter(citizen => citizen.mapSquare === mapSquare)[0]
        const showYields = mapSquare === town.mapSquare || citizen;

        if (isCorner && excludeCorners) {
            return this.renderEmptyTile(mapSquare.x, mapSquare.y)
        }

        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={handleMapSectionClick ? () => { handleMapSectionClick(mapSquare) } : null}
                mapSquare={mapSquare}
                onMapSection={true}
                town={isTownTile ? town : null}
                isSelected={mapSquare === selectedSquare}
                showYields={showYields}
                occupier={occupier}
                unitsInMapSquare={units.filter(unit => areSamePlace(unit, mapSquare))}
                citizenOutput={citizen ? citizen.getOutput(town) : null}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
            />
        )
    }

    renderEmptyRow(y) {
        const { span, xStart } = this
        let emptyTiles = []

        for (let x = xStart; x < xStart + span; x++) {
            emptyTiles.push(this.renderEmptyTile(x, y))
        }
        return (
            <div className={styles.row} key={`row ${y}`}>{emptyTiles}</div>
        )
    }

    renderRow(row, y, occupiersMap) {
        const { stateOfPlay } = this.props
        const { mapGrid } = stateOfPlay
        const { span, yStart, xStart, } = this
        if (y < yStart || y > yStart + span - 1) { return null }

        let tiles = row.map(mapSquare => {
            const occupier = occupiersMap.some(item => item.mapSquare === mapSquare)
                ? occupiersMap.filter(item => item.mapSquare === mapSquare)[0].obstacle
                : null;
            return this.renderTile(mapSquare, true, occupier)
        })
        let emptyTileX

        if (xStart < 0) {
            for (emptyTileX = xStart; emptyTileX < 0; emptyTileX++) {
                tiles.unshift(this.renderEmptyTile(emptyTileX, y))
            }
        }

        if (xStart + span >= mapGrid[y].length) {
            for (emptyTileX = mapGrid[y].length; emptyTileX < xStart + span; emptyTileX++) {
                tiles.push(this.renderEmptyTile(emptyTileX, y))
            }
        }

        return (
            <div className={styles.row} key={`row ${y}`}>{tiles}</div>
        )
    }



    renderCitizen(citizen, index) {
        const { handleMapSectionClick } = this.props
        const { yStart, xStart } = this

        const xPlacement = citizen.mapSquare.x - xStart
        const yPlacement = citizen.mapSquare.y - yStart

        const figureStyle = {
            left: `${xPlacement * 4}em`,
            top: `${yPlacement * 4}em`,
        }

        return (
            <figure
                style={figureStyle}
                className={styles.citizenFigure}
                onClick={handleMapSectionClick ? () => { handleMapSectionClick(citizen.mapSquare) } : null}
                key={`citizenIcon-${index}`}>

                <i className={styles.spriteOnMapSection}
                    style={citizen.job.spriteStyle}
                />

            </figure>
        )
    }

    render() {
        const { town, stateOfPlay } = this.props
        const { mapGrid, towns, units } = stateOfPlay
        const { span, yStart } = this
        let emptyRowY

        let emptyRowsAbove = []
        if (yStart < 0) {
            for (emptyRowY = yStart; emptyRowY < 0; emptyRowY++) {
                emptyRowsAbove.push(this.renderEmptyRow(emptyRowY))
            }
        }

        let emptyRowsBelow = []
        if (yStart + span >= mapGrid.length) {
            for (emptyRowY = mapGrid.length; emptyRowY < yStart + span; emptyRowY++) {
                emptyRowsBelow.push(this.renderEmptyRow(emptyRowY))
            }
        }

        let citizensOnMap = town.citizens
            .filter(citizen => citizen.mapSquare)
            .map((citizen, index) => this.renderCitizen(citizen, index))

        const occupiersMap = town.getOccupierMap(mapGrid, towns, units)

        return (
            <section className={styles.container}>
                <div className={styles.frame}>
                    {emptyRowsAbove}
                    {mapGrid.map((row, index) => this.renderRow(row, index, occupiersMap))}
                    {emptyRowsBelow}
                    {citizensOnMap}
                </div>
            </section>
        )
    }
}