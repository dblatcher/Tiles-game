import React from 'react';

import Tile from './Tile'
import styles from './mapSection.module.scss'
import VoidMapSquare from "../lib/game-entities/VoidMapSquare";
import { areSamePlace } from '../lib/utility';

import UnitFigure from './UnitFigure';
import CitizenFigure from './figures/CitizenFigure'

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

    get mapXOffset() {
        return this.props.town.x - this.props.radius
    }
    get mapYOffset() {
        return this.props.town.y - this.props.radius
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
        const { span, mapXOffset, mapYOffset, } = this

        if (mapSquare.x < mapXOffset || mapSquare.x > mapXOffset + span - 1) { return null }

        const isCorner = (mapSquare.x === mapXOffset || mapSquare.x === mapXOffset + span - 1) && (mapSquare.y === mapYOffset || mapSquare.y === mapYOffset + span - 1)
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
        const { span, mapXOffset } = this
        let emptyTiles = []

        for (let x = mapXOffset; x < mapXOffset + span; x++) {
            emptyTiles.push(this.renderEmptyTile(x, y))
        }
        return (
            <div className={styles.row} key={`row ${y}`}>{emptyTiles}</div>
        )
    }

    renderRow(row, y, occupiersMap) {
        const { stateOfPlay } = this.props
        const { mapGrid } = stateOfPlay
        const { span, mapYOffset, mapXOffset, } = this
        if (y < mapYOffset || y > mapYOffset + span - 1) { return null }

        let tiles = row.map(mapSquare => {
            const occupier = occupiersMap.some(item => item.mapSquare === mapSquare)
                ? occupiersMap.filter(item => item.mapSquare === mapSquare)[0].obstacle
                : null;
            return this.renderTile(mapSquare, true, occupier)
        })
        let emptyTileX

        if (mapXOffset < 0) {
            for (emptyTileX = mapXOffset; emptyTileX < 0; emptyTileX++) {
                tiles.unshift(this.renderEmptyTile(emptyTileX, y))
            }
        }

        if (mapXOffset + span >= mapGrid[y].length) {
            for (emptyTileX = mapGrid[y].length; emptyTileX < mapXOffset + span; emptyTileX++) {
                tiles.push(this.renderEmptyTile(emptyTileX, y))
            }
        }

        return (
            <div className={styles.row} key={`row ${y}`}>{tiles}</div>
        )
    }


    render() {
        const { town, stateOfPlay } = this.props
        const { mapGrid, towns, units } = stateOfPlay
        const { span, mapYOffset, mapXOffset } = this
        const occupiersMap = town.getOccupierMap(mapGrid, towns, units)

        let emptyRowY
        let emptyRowsAbove = []
        if (mapYOffset < 0) {
            for (emptyRowY = mapYOffset; emptyRowY < 0; emptyRowY++) {
                emptyRowsAbove.push(this.renderEmptyRow(emptyRowY))
            }
        }

        let emptyRowsBelow = []
        if (mapYOffset + span >= mapGrid.length) {
            for (emptyRowY = mapGrid.length; emptyRowY < mapYOffset + span; emptyRowY++) {
                emptyRowsBelow.push(this.renderEmptyRow(emptyRowY))
            }
        }

        let citizensOnMap = town.citizens
            .filter(citizen => citizen.mapSquare)
            .map((citizen, index) => (
                <CitizenFigure key={index}
                    citizen={citizen}
                    mapXOffset={mapXOffset}
                    mapYOffset={mapYOffset}
                    handleClick={() => { handleMapSectionClick(citizen.mapSquare) }}
                />
            ))


        let occupyingCitizensOnMap = occupiersMap
            .filter(entry => entry.obstacle.citizen && !town.citizens.includes(entry.obstacle.citizen))
            .map(entry => entry.obstacle)
            .map((obstacle, index) => (
                <CitizenFigure key={"occupier" + index}
                    citizen={obstacle.citizen}
                    occupierTown={obstacle.town}
                    mapXOffset={mapXOffset}
                    mapYOffset={mapYOffset}
                />
            ))

        let occupyingUnitsOnMap = occupiersMap
                .filter(entry => entry.obstacle.classIs === 'Unit')
                .map(entry => entry.obstacle)
                .map(unit => (
                    <UnitFigure unit={unit} key={unit.indexNumber}
                        mapXOffset={mapXOffset}
                        mapYOffset={mapYOffset}
                        isOccupier />
                ))

        return (
            <section className={styles.container}>
                <div className={styles.frame}>
                    {emptyRowsAbove}
                    {mapGrid.map((row, index) => this.renderRow(row, index, occupiersMap))}
                    {emptyRowsBelow}
                    {citizensOnMap}
                    {occupyingCitizensOnMap}
                    {occupyingUnitsOnMap}
                </div>
            </section>
        )
    }
}