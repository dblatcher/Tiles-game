import react from 'react'
import React from 'react'
import styles from './unitFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class UnitFigure extends react.Component {


    render() {
        const { unit, handleClick, isSelected, inInfoRow, stack, isFallen } = this.props

        const placeInStack = inInfoRow
            ? 0
            : stack ? stack.indexOf(unit) : 0

        let figureClassList = [styles.figure]
        let spirteClassList = [styles.sprite]
        let orderFlagClassList = [styles.orderFlag]

        figureClassList.push(inInfoRow ? styles.inInfoRow : styles.onMap)
        if (!inInfoRow && isSelected) {
            figureClassList.push(styles.selected)
            spirteClassList.push(styles.flashing, styles.selected)
            orderFlagClassList.push(styles.selected)
        }

        if (isFallen) {
            spirteClassList.push(styles.fallen)
        }

        if (placeInStack > 0) { spirteClassList.push(styles.behind) }

        const figureStyle = {
            left: inInfoRow ? 'unset' : `${unit.x * 4}rem`,
            top: inInfoRow ? 'unset' : `${unit.y * 4}rem`,
            backgroundImage: isFallen 
            ? ''
            : placeInStack === 0
                ? `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 65%)`
                : `radial-gradient(${unit.faction.color} 45%, rgba(0,0,0,0) 55%)`,
            transform: `translate(${-Math.min(placeInStack, 5) * 8}px, ${-Math.min(placeInStack, 5) * 2}px)`
        }

        return (
            <figure
                style={figureStyle}
                className={figureClassList.join(" ")}
                onClick={handleClick || function () { }}>
                <i
                    style={spriteSheets.units.getStyleForFrameCalled(unit.type.name)}
                    className={spirteClassList.join(" ")}>
                </i>

                {unit.onGoingOrder
                    ? <p className={orderFlagClassList.join(" ")}>
                        <span>{unit.onGoingOrder.type.letterCode}</span>
                        <span>{unit.onGoingOrder.timeRemaining}</span>
                    </p>
                    : null
                }
            </figure>
        )

    }

}