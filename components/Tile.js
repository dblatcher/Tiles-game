import React from 'react'
import SvgIcon from './SvgIcon'
import TownFigure from './TownFigure';
import styles from './tile.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'


export default class Tile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isHoveredOn: false
        }
        this.handleHover = this.handleHover.bind(this)
    }

    handleHover(wasEnterEvent) {
        const { inInfoRow, handleTileHoverEnter, mapSquare } = this.props
        this.setState({ isHoveredOn: wasEnterEvent }, () => {
            if (!inInfoRow && this.state.isHoveredOn && handleTileHoverEnter) {
                handleTileHoverEnter(mapSquare)
            }
        })
    }

    doesNeedCoastline() {
        const { mapSquare, adjacentSquares } = this.props
        if (!adjacentSquares) { return false }
        for (let key in adjacentSquares) {
            if (adjacentSquares[key] && adjacentSquares[key].isWater != mapSquare.isWater) { return true }
        }
        return false
    }

    renderDirectionedSprite(spriteSheet) {
        const { adjacentSquares, inInfoRow } = this.props
        let style = spriteSheet.getStyleFromAdjacentSquares(adjacentSquares)
        if (inInfoRow) { style.top = "0" } //override the top property used on spriteSheets.trees.css
        return <i className={styles.spriteHolder} style={style}></i>
    }

    renderNamedFrameSprite(spriteSheet, frameName) {
        let style = spriteSheet.getStyleForFrameCalled(frameName)
        return <i className={styles.spriteHolder} style={style}></i>
    }

    renderYieldLines() {
        const { mapSquare } = this.props

        return <>
            {mapSquare.foodYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.foodYield} <SvgIcon iconName="food" color="white" />
                </p>
                : null}
            {mapSquare.productionYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.productionYield} <SvgIcon iconName="production" color="white" />
                </p>
                : null}

            {mapSquare.tradeYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.tradeYield} <SvgIcon iconName="trade" color="white" />
                </p>
                : null}
        </>
    }

    render() {
        const { mapSquare, handleClick, isSelected,
            selectedUnit, inInfoRow, squareSelectedUnitIsIn, interfaceMode,
            gameHasOpenDialogue, showYields, town, onMapSection, occupier } = this.props
        const { isHoveredOn } = this.state

        const containsSelectedUnit = selectedUnit && (mapSquare.x === selectedUnit.x && mapSquare.y === selectedUnit.y);
        const selectedUnitCanMoveTo = selectedUnit && selectedUnit.canMoveTo(mapSquare, squareSelectedUnitIsIn);
        const needsCoastLine = this.doesNeedCoastline()

        let classList = [styles.tile]

        if (!inInfoRow) {
            if (interfaceMode === 'VIEW') {
                if (isSelected) { classList.push(styles.selected) }
            } else if (interfaceMode === 'MOVE') {
                if (!gameHasOpenDialogue && selectedUnitCanMoveTo) { classList.push(styles.inRange) }

                if (!gameHasOpenDialogue && isHoveredOn && selectedUnitCanMoveTo) { classList.push(styles.inRangeHovered) }
                if (!gameHasOpenDialogue && isHoveredOn && !selectedUnitCanMoveTo) { classList.push(styles.hovered) }
            }

        }

        if (occupier) { classList.push(styles.occupied) }

        return (
            <figure
                style={mapSquare.css || {}}
                className={classList.join(" ")}
                onClick={handleClick || function () { }}
                onPointerEnter={() => { this.handleHover(true) }}
                onPointerLeave={() => { this.handleHover(false) }}
            >
                {needsCoastLine && mapSquare.isWater ? this.renderDirectionedSprite(spriteSheets.coastlines) : (null)}
                {needsCoastLine && !mapSquare.isWater ? this.renderDirectionedSprite(spriteSheets.innerCoastlines) : (null)}

                {mapSquare.terrain.spriteCss ? (
                    <i className={styles.spriteHolder} style={mapSquare.terrain.spriteCss}></i>
                ) : null}

                {mapSquare.road ? this.renderDirectionedSprite(spriteSheets.roads) : (null)}

                { town ? <TownFigure town={town} onMapSection={onMapSection} /> : null}

                {mapSquare.tree ? this.renderDirectionedSprite(spriteSheets.trees) : (null)}
                {mapSquare.irrigation ? this.renderNamedFrameSprite(spriteSheets.misc, 'irrigation') : (null)}
                {mapSquare.mine ? this.renderNamedFrameSprite(spriteSheets.misc, 'mine') : (null)}

                {showYields ? this.renderYieldLines() : null}

            </figure>
        )
    }
}
