import { onGoingOrderTypes } from '../lib/game-entities/OngoingOrder.tsx'

import styles from './unitContextMenu.module.scss'

export default function UnitContextMenu(props) {
    const { selectedUnit, handleOrderButton, squareSelectedUnitIsIn, placement = [] } = props;

    const availableOrders = selectedUnit
        ? onGoingOrderTypes
            .filter(orderType => orderType.canUnitUse(selectedUnit))
            .map(orderType => {

                const isDisabled = !orderType.checkIsValidForSquare(squareSelectedUnitIsIn) || selectedUnit.remainingMoves === 0
                const isCancel = !orderType.cannotCancel && selectedUnit.onGoingOrder && selectedUnit.onGoingOrder.type == orderType
                let buttonStyles = [styles.button]
                let onClickFunction;

                if (isCancel) {
                    buttonStyles.push(styles.buttonCancel)
                    onClickFunction = () => { handleOrderButton('CANCEL_ORDER') }
                }
                else if (isDisabled) {
                    buttonStyles.push(styles.buttonDisabled)
                }
                else {
                    onClickFunction = () => { handleOrderButton('START_ORDER', { orderType, unit: selectedUnit }) }
                }

                return { orderType, buttonStyles, onClickFunction }
            })
        : [];

    let navClassList = [styles.contextMenu]

    if (placement.includes('BELOW')) { 
        if (placement.includes('RIGHT')) {
            navClassList.push(styles.contextMenuBelowRight) 
        } else if (placement.includes('LEFT')) {
            navClassList.push(styles.contextMenuBelowLeft) 
        } else {
            navClassList.push(styles.contextMenuBelow) 
        }
    } else {
        if (placement.includes('RIGHT')) {
            navClassList.push(styles.contextMenuAboveRight) 
        } else if (placement.includes('LEFT')) {
            navClassList.push(styles.contextMenuAboveLeft) 
        } else {
            navClassList.push(styles.contextMenuAbove) 
        } 
    }
    

    return <nav className={navClassList.join(" ")}>
        {availableOrders.map(availableOrder => (
            <button className={availableOrder.buttonStyles.join(" ")}
                key={"order-" + availableOrder.orderType.name}
                title={availableOrder.orderType.name}
                onClick={availableOrder.onClickFunction}>
                {availableOrder.orderType.letterCode}
            </button>
        ))}
    </nav>
}