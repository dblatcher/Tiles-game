import React from 'react'
import styles from './tile.module.scss'
import {spriteSheets, SpriteSheet} from '../lib/SpriteSheet.tsx'


export default class Tile extends React.Component {

    render() {
        const { mapSquare, adjacentSquares, handleClick} = this.props

        return (
        <figure className={styles.tile} onClick={handleClick}>
            <p>{mapSquare.terrain.name}</p>

            {mapSquare.road ? (
                <div 
                    className={styles.spriteHolder} 
                    style={SpriteSheet.getStyle(spriteSheets.roads, adjacentSquares )}
                ></div>
            ) : (null) }

            {mapSquare.tree ? (
                <div 
                    className={styles.spriteHolder} 
                    style={SpriteSheet.getStyle(spriteSheets.trees, adjacentSquares )}
                ></div>
            ) : (null) }
        </figure>
        )
    }
}
