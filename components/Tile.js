import React from 'react'
import styles from './tile.module.scss'


const trees = {
    cols: 3,
    rows: 4,
    url: '/spriteSheet.png'
}

function makeSpriteStyle (sprite, frameX, frameY) {
    return {
        backgroundSize:  `${trees.cols*100}% ${trees.rows*100}%`,
        backgroundPosition: `${100*frameX / (trees.cols -1)}% ${100*frameY / (trees.rows-1)}%`,
        backgroundImage: `url(${trees.url})`
    } 
}

export default class Tile extends React.Component {


    render() {
        const { mapSquare } = this.props

        let spriteStyle = makeSpriteStyle(trees, 1,3)
        return (<figure className={styles.tile}>
            <p>{mapSquare.terrain.name}</p>

            {mapSquare.tree ? <div 
                className={styles.treeSprite}
                style={spriteStyle}
            ></div> : (null) }
        </figure>)

    }
}