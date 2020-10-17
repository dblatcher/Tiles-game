import React from 'react'

import OrderButtons from './OrderButtons'

import styles from './unitFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class UnitFigure extends React.Component {

    renderUnitMenu() {

        const { unit, handleOrderButton, squareUnitIsOn } = this.props

        return (
            <nav className={styles.contextMenu}>
                <OrderButtons
                    unitContextMenu={true}
                    selectedUnit={unit}
                    squareSelectedUnitIsIn={squareUnitIsOn}
                    handleOrderButton={handleOrderButton} />
            </nav>
        )
    }

    render() {
        const { unit, handleClick, isSelected, inInfoRow, stack, isFallen, menuIsOpen } = this.props

        const placeInStack = inInfoRow
            ? 0
            : stack ? stack.indexOf(unit) : 0

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]
        let orderFlagClassList = [styles.orderFlag]

        figureClassList.push(inInfoRow ? styles.figureInInfoRow : styles.figureOnMap)
        if (!inInfoRow && isSelected) {
            figureClassList.push(styles.topOfStack)
            spriteClassList.push(styles.flashingSprite, styles.topOfStack)
            orderFlagClassList.push(styles.topOfStack)
        }

        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        if (placeInStack > 0) { spriteClassList.push(styles.behind) }

        const figureStyle = {
            left: inInfoRow ? 'unset' : `${unit.x * 4}rem`,
            top: inInfoRow ? 'unset' : `${unit.y * 4}rem`,
            backgroundImage: isFallen
                ? ''
                : placeInStack === 0
                    ? `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 65%)`
                    : `radial-gradient(${unit.faction.color} 45%, rgba(0,0,0,0) 55%)`,
            transform: `translate(${-Math.min(placeInStack, 5) * 8}px, ${-Math.min(placeInStack, 5) * 2}px)`,
            pointerEvents: isFallen ? 'none' : 'unset',
        }

        return (
            <figure
                style={figureStyle}
                className={figureClassList.join(" ")}
                >
                <i
                    style={spriteSheets.units.getStyleForFrameCalled(unit.type.name)}
                    className={spriteClassList.join(" ")}
                    onClick={handleClick || function () { }}
                    >
                </i>

                {unit.onGoingOrder
                    ? <p className={orderFlagClassList.join(" ")}>
                        <span>{unit.onGoingOrder.type.letterCode}</span>
                        <span>{unit.onGoingOrder.timeRemaining}</span>
                    </p>
                    : null
                }

                {menuIsOpen && isSelected ? this.renderUnitMenu() : null}
            </figure>
        )

    }

}