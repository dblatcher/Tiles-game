import React from 'react'
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
        const { mapSquare, handleClick, isSelected, selectedUnit, inInfoRow } = this.props
        const { isHoveredOn } = this.state
        const containsSelectedUnit = selectedUnit && (mapSquare.x === selectedUnit.x && mapSquare.y === selectedUnit.y);

        let classList = [styles.tile]
        if (isHoveredOn && !inInfoRow) { classList.push(styles.hovered) }
        if (isSelected) { classList.push(styles.selected) }

        return (
            <figure
                style={mapSquare.css || {}}
                className={classList.join(" ")}
                onClick={handleClick || function () { }}
                onPointerEnter={() => { this.handleHover(true) }}
                onPointerLeave={() => { this.handleHover(false) }}
            >
                {mapSquare.road ? this.renderSprite(spriteSheets.roads) : (null)}
                {mapSquare.tree ? this.renderSprite(spriteSheets.trees) : (null)}
            </figure>
        )
    }
}
