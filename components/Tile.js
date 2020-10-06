import React from 'react'
import styles from './tile.module.scss'

export default class Tile extends React.Component {


    render() {
        const { mapSquare } = this.props

    return (<figure className={styles.tile}>
        <p>{mapSquare.terrain.name}</p>
        <p>{mapSquare.tree ? "tree" : "no tree"}</p>
    </figure>)

    }
}