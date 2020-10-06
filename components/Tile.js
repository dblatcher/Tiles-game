import React from 'react'
import styles from './tile.module.scss'


const trees = {
    cols: 3,
    rows: 4,
    url: '/spriteSheet.png'
}

function getRightFrame (sprite, adjacents, message) {

    
    let bitString = ''

    bitString += adjacents.before && adjacents.before.tree ? "1":"0";
    bitString += adjacents.after && adjacents.after.tree ? "1":"0";
    bitString += adjacents.above && adjacents.above.tree ? "1":"0";
    bitString += adjacents.below && adjacents.below.tree? "1":"0";

    switch (bitString) {
        case "0000": return[sprite, 0,0];
        case "0010": return[sprite, 1,0];
        case "0001": return[sprite, 2,0];
        
        case "0100": return[sprite, 0,1];
        case "1000": return[sprite, 1,1];
        case "1100": return[sprite, 2,1];
        
        case "0011": return[sprite, 0,2];
        case "0101": return[sprite, 1,2];
        case "1001": return[sprite, 2,2];

        case "0110": return [sprite, 0,3]
        case "1010": return [sprite, 1,3]
        case "1111": return[sprite, 2,3];
        default: 
        return [sprite, 2,3]
    }

}

function makeSpriteStyle (sprite, frameX, frameY) {
    return {
        backgroundSize:  `${sprite.cols*100}% ${sprite.rows*100}%`,
        backgroundPosition: `${100*frameX / (sprite.cols -1)}% ${100*frameY / (sprite.rows-1)}%`,
        backgroundImage: `url(${sprite.url})`
    } 
}

export default class Tile extends React.Component {


    render() {
        const { mapSquare, adjacentSquares, handleClick} = this.props


        let spriteStyle = mapSquare.tree
        ? makeSpriteStyle( ...getRightFrame(trees, adjacentSquares,`${mapSquare.x}, ${mapSquare.y}`) )
        :{}


        return (
        <figure className={styles.tile} onClick={handleClick}>
            <p>{mapSquare.terrain.name}</p>

            {mapSquare.tree ? (
                <div className={styles.treeSprite} style={spriteStyle}></div>
            ) : (null) }
        </figure>
        )

    }
}