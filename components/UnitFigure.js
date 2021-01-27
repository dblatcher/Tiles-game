import React from 'react'
import UnitContextMenu from './UnitContextMenu'
import styles from './unitFigure.module.scss'


export default class UnitFigure extends React.Component {

    get leftProperty() {
        if (this.props.inInfoRow) { return 'unset' }
        return `${this.shiftedX * 4}em`
    }

    get topProperty() {
        const { unit, inInfoRow, mapYOffset = 0 } = this.props

        if (inInfoRow) { return 'unset' }
        return `${(unit.y - mapYOffset) * 4}em`
    }

    get shiftedX() {
        const { unit, mapXOffset = 0, gridWidth } = this.props
        let shiftedX = unit.x - mapXOffset
        if (shiftedX < 0) { shiftedX += gridWidth }
        return shiftedX
    }

    renderUnitMenu() {
        const { unit, handleOrderButton, squareUnitIsOn, gridWidth } = this.props
        const { shiftedX } = this
        let placement = []

        if (squareUnitIsOn.y < 3) { placement.push('BELOW') }
        if (shiftedX < 3) { placement.push('RIGHT') }
        if (gridWidth && (shiftedX > gridWidth - 3)) { placement.push('LEFT') }

        return (
            <UnitContextMenu
                selectedUnit={unit}
                squareSelectedUnitIsIn={squareUnitIsOn}
                handleOrderButton={handleOrderButton}
                placement={placement} />
        )
    }

    render() {
        const {
            unit, handleClick, isSelected, inInfoRow, stack, isFallen, interfaceMode, notInSight,
            mapShiftInProgress
        } = this.props

        if (unit.isPassengerOf && !isSelected && !inInfoRow) {
            return null // TO DO - render list of passengers with transport? use orderFlag style? 
        }

        const placeInStack = inInfoRow
            ? 0
            : stack ? stack.indexOf(unit) : 0

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]
        let orderFlagClassList = [styles.orderFlag]

        figureClassList.push(inInfoRow ? styles.inInfoRow : styles.onMap)
        if (!inInfoRow && isSelected) {
            figureClassList.push(styles.topOfStack)
            spriteClassList.push(styles.flashingSprite, styles.topOfStack)
            orderFlagClassList.push(styles.topOfStack)

        }
        if (!mapShiftInProgress) {
            figureClassList.push(styles.slide)
        }

        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        if (notInSight && !isFallen) {
            return null
        }

        if (placeInStack > 0) { spriteClassList.push(styles.behind) }


        const figureStyle = {
            left: this.leftProperty,
            top: this.topProperty,
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
                    style={unit.type.spriteStyle}
                    className={spriteClassList.join(" ")}
                    onClick={handleClick
                        ? () => { return handleClick(false) }
                        : null
                    }
                    onContextMenu={handleClick
                        ? (event) => { 
                            event.preventDefault()
                            return handleClick(true) 
                        }
                        : null
                    }
                ></i>

                { unit.onGoingOrder && !unit.onGoingOrder.type.noFlag
                    ? <p className={orderFlagClassList.join(" ")}>
                        <span>{unit.onGoingOrder.type.letterCode}</span>
                        <span>{unit.onGoingOrder.timeRemaining === Infinity ? '' : unit.onGoingOrder.timeRemaining}</span>
                    </p>
                    : null}

                { !unit.faction.isComputerPlayer && isSelected && interfaceMode === 'MOVE' ? this.renderUnitMenu() : null}
            </figure >
        )

    }

}