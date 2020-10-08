import React from 'react'
import styles from './tile.module.scss'
import { spriteSheets, SpriteSheet } from '../lib/SpriteSheet.tsx'


export default class Tile extends React.Component {

    renderSprite(spriteSheet) {
        const { adjacentSquares } = this.props
        return (
            <div
                className={styles.spriteHolder}
                style={SpriteSheet.getStyle(spriteSheet, adjacentSquares)}
            ></div>)
    }

    render() {
        const { mapSquare, handleClick } = this.props

        return (
            <figure className={styles.tile} onClick={handleClick || function(){} }>
                <p>{mapSquare.terrain.name}</p>
                {mapSquare.road ? this.renderSprite(spriteSheets.roads) : (null)}
                {mapSquare.tree ? this.renderSprite(spriteSheets.trees) : (null)}
            </figure>
        )
    }
}
