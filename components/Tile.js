import React from 'react'
import SvgIcon from './SvgIcon'
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

    renderSprite(spriteSheet) {
        const { adjacentSquares, inInfoRow } = this.props
        let style = spriteSheet.getStyleFromAdjacentSquares(adjacentSquares)
        if (inInfoRow) { style.top = "0" } //override the top property used on spriteSheets.trees.css

        return (
            <i
                className={styles.spriteHolder}
                style={style}
            ></i>)
    }

    render() {
        const { mapSquare, handleClick, isSelected, selectedUnit, inInfoRow, squareSelectedUnitIsIn, interfaceMode, gameHasOpenDialogue, showYields } = this.props
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


        return (
            <figure
                style={mapSquare.css || {}}
                className={classList.join(" ")}
                onClick={handleClick || function () { }}
                onPointerEnter={() => { this.handleHover(true) }}
                onPointerLeave={() => { this.handleHover(false) }}
            >
                {needsCoastLine && mapSquare.isWater ? this.renderSprite(spriteSheets.coastlines) : (null)}
                {needsCoastLine && !mapSquare.isWater ? this.renderSprite(spriteSheets.innerCoastlines) : (null)}
                {mapSquare.road ? this.renderSprite(spriteSheets.roads) : (null)}
                {mapSquare.tree ? this.renderSprite(spriteSheets.trees) : (null)}

                {showYields
                    ? <>
                        <p className={styles.yieldLine}>
                            {mapSquare.foodYield}
                            <SvgIcon iconName="food" color="white"/>
                        </p>
                        <p className={styles.yieldLine}>
                            {mapSquare.productionYield}
                            <SvgIcon iconName="production" color="white"/>
                        </p>
                        <p className={styles.yieldLine}>
                            {mapSquare.tradeYield}
                            <SvgIcon iconName="trade" color="white"/>
                        </p>
                    </>
                    : null}

            </figure>
        )
    }
}
