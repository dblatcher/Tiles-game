import react from 'react'
import React from 'react'
import styles from './unitFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class UnitFigure extends react.Component {


    render() {
        const { unit } = this.props

        const figureStyle = {
            left: `${unit.x * 4}rem`,
            top: `${unit.y * 4}rem`,
            backgroundImage: `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 65%`,
        }

        return (
            <figure
                style={figureStyle}
                className={styles.holder}>

                <i
                    style={spriteSheets.units.getStyleForFrameCalled(unit.type.name)}
                    className={styles.sprite}>
                </i>
            </figure>
        )

    }

}