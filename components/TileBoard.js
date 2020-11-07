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

    renderTile(mapSquare, placesInSight) {
        const { handleMapSquareClick, selectedSquare, selectedUnit, handleTileHoverEnter, mapGrid, interfaceMode, gameHasOpenDialogue, towns } = this.props;
        const town = towns.filter(town => town.mapSquare === mapSquare)[0]


        const notInSight = !placesInSight.some(square => {
            return square.x === mapSquare.x && square.y === mapSquare.y
        })



        return (
            <Tile key={`${mapSquare.x},${mapSquare.y}`}
                handleClick={() => { handleMapSquareClick({ mapSquare, source: 'tile' }) }}
                interfaceMode={interfaceMode}
                mapSquare={mapSquare}
                town={town}
                selectedUnit={selectedUnit}
                squareSelectedUnitIsIn={selectedUnit ? mapGrid[selectedUnit.y][selectedUnit.x] : null}
                isSelected={mapSquare === selectedSquare}
                handleTileHoverEnter={handleTileHoverEnter}
                adjacentSquares={this.getAdjacentSquares(mapSquare.x, mapSquare.y)}
                gameHasOpenDialogue={gameHasOpenDialogue}
                notInSight={notInSight}
            />
        )
    }

    renderRow(row, y, placesInSight) {
        return (
            <div className={styles.row} key={`row ${y}`}>
                {row.map(mapSquare => this.renderTile(mapSquare, placesInSight))}
            </div>
        )
    }

    renderUnit(unit, placesInSight) {
        const { handleMapSquareClick, selectedUnit, fallenUnits, mapGrid, unitWithMenuOpen, handleOrderButton, interfaceMode, } = this.props;
        const squareUnitIsOn = mapGrid[unit.y][unit.x]

        const notInSight = !placesInSight.some(square => {
            return square.x === unit.x && square.y === unit.y
        })

        return (<UnitFigure
            handleClick={() => {
                handleMapSquareClick({ mapSquare: squareUnitIsOn, source: 'unit' })
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
            notInSight={notInSight}
        />)
    }

    render() {
        const { mapGrid, units = [], fallenUnits = [], towns = [], mapZoomLevel = 1, activeFaction } = this.props
        const sectionStyle = { fontSize: `${mapZoomLevel * 100}%` }

        const placesInSight = activeFaction
            ? activeFaction.getPlacesInSight(towns, units)
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