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
        this.setState({
            isHoveredOn: wasEnterEvent
        })
    }

    renderSprite(spriteSheet) {
        const { adjacentSquares } = this.props
        return (
            <div
                className={styles.spriteHolder}
                style={spriteSheet.getStyleFromAdjacentSquares(adjacentSquares)}
            ></div>)
    }

    render() {
        const { mapSquare, handleClick, isSelected, selectedUnit} = this.props
        const {isHoveredOn} =  this.state
        const containsSelectedUnit = selectedUnit && (mapSquare.x === selectedUnit.x && mapSquare.y === selectedUnit.y  );

        let classList = [styles.tile]
        if (isHoveredOn) {classList.push(styles.hovered)}
        if (isSelected) {classList.push(styles.selected)}

        return (
            <figure
                style={mapSquare.css || {}}
                className={classList.join(" ")}
                onClick={handleClick || function () { }}
                onPointerEnter={ ()=>{this.handleHover(true)} }
                onPointerLeave={ ()=>{this.handleHover(false)} }
                >
                {mapSquare.road ? this.renderSprite(spriteSheets.roads) : (null)}
                {mapSquare.tree ? this.renderSprite(spriteSheets.trees) : (null)}
            </figure>
        )
    }
}
