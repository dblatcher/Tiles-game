import React from 'react'

import UnitContextMenu from './UnitContextMenu'

import styles from './unitFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class UnitFigure extends React.Component {

    renderUnitMenu() {
        const { unit, handleOrderButton, squareUnitIsOn, gridWidth } = this.props
        let placement = []

        if (squareUnitIsOn.y < 3) { placement.push('BELOW') }
        if (squareUnitIsOn.x < 3) { placement.push('RIGHT') }
        if (gridWidth && (squareUnitIsOn.x > gridWidth - 3)) { placement.push('LEFT') }

        return (
            <UnitContextMenu
                selectedUnit={unit}
                squareSelectedUnitIsIn={squareUnitIsOn}
                handleOrderButton={handleOrderButton}
                placement={placement} />
        )
    }

    render() {
        const { unit, handleClick, isSelected, inInfoRow, stack, isFallen, menuIsOpen, interfaceMode, notInSight } = this.props

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

        if (notInSight && !isFallen) {
            return null
        }

        if (placeInStack > 0) { spriteClassList.push(styles.behind) }

        const figureStyle = {
            left: inInfoRow ? 'unset' : `${unit.x * 4}em`,
            top: inInfoRow ? 'unset' : `${unit.y * 4}em`,
            backgroundImage: isFallen
                ? ''
                : unit.vetran
                    ? placeInStack === 0
                        ? `radial-gradient(${unit.faction.color} 45%, black 45%, ${unit.faction.color} 55%, ${unit.faction.color} 65%,  rgba(0,0,0,0) 65%)`
                        : `radial-gradient(${unit.faction.color} 40%, black 40%, ${unit.faction.color} 45%, ${unit.faction.color} 55%,  rgba(0,0,0,0) 55%)`
                    : placeInStack === 0
                        ? `radial-gradient(${unit.faction.color} 65%, rgba(0,0,0,0) 65%)`
                        : `radial-gradient(${unit.faction.color} 55%, rgba(0,0,0,0) 55%)`,
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
                ></i>

                { unit.onGoingOrder && !unit.onGoingOrder.type.noFlag
                    ? <p className={orderFlagClassList.join(" ")}>
                        <span>{unit.onGoingOrder.type.letterCode}</span>
                        <span>{unit.onGoingOrder.timeRemaining}</span>
                    </p>
                    : null}

                { menuIsOpen && isSelected && interfaceMode === 'MOVE' ? this.renderUnitMenu() : null}
            </figure >
        )

    }

}