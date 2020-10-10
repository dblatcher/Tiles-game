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
            backgroundImage: `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 65%`,
        }

        let figureClassList = [styles.figure]
        figureClassList.push (inInfoRow ? styles.inInfoRow :styles.onMap)

        let spirteClassList = [styles.sprite]       
        if (!inInfoRow && isSelected) {spirteClassList.push(styles.selected)}


        return (
            <figure
                style={figureStyle}
                className={figureClassList.join(" ")}
                onClick={handleClick || function () { }}>
                <i
                    style={spriteSheets.units.getStyleForFrameCalled(unit.type.name)}
                    className={spirteClassList.join(" ")}>
                </i>
            </figure>
        )

    }

}