import react from 'react'
import React from 'react'
import styles from './unitFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class UnitFigure extends react.Component {


    render() {
        const { unit, handleClick, isSelected, inInfoRow } = this.props

        const figureStyle = {
            left: inInfoRow ? 'unset' : `${unit.x * 4}rem`,
            top:  inInfoRow ? 'unset' : `${unit.y * 4}rem`,
            backgroundImage: isSelected 
            ? `radial-gradient(${unit.faction.color} 85%, rgba(0,0,0,0) 85%`
            : `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 65%`
        }

        return (
            <figure
                style={figureStyle}
                className={inInfoRow ? styles.infoRowHolder :styles.holder}
                onClick={handleClick || function () { }}>
                <i
                    style={spriteSheets.units.getStyleForFrameCalled(unit.type.name)}
                    className={styles.sprite}>
                </i>
            </figure>
        )

    }

}