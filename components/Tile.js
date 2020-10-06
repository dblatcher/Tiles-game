import React from 'react'
import styles from './tile.module.css'

export default class Tile extends React.Component {


    render() {
        const {mapSquare} = this.props

    return (<figure className={styles.tile}>{mapSquare.terrain.name}</figure>)

    }
}