import { onGoingOrderTypes } from '../lib/OngoingOrder.tsx'

import styles from './orderButtons.module.scss'

export default function UnitContextMenu(props) {
    const { selectedUnit, handleOrderButton, squareSelectedUnitIsIn } = props;

    const availableOrders = selectedUnit
        ? onGoingOrderTypes
            .filter(orderType => orderType.canUnitUse(selectedUnit))
            .map(orderType => {

                const isDisabled = !orderType.checkIsValidForSquare(squareSelectedUnitIsIn) || selectedUnit.remainingMoves === 0
                const isCancel = !orderType.cannotCancel &&  selectedUnit.onGoingOrder && selectedUnit.onGoingOrder.type == orderType
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

    return <nav className={styles.contextMenu}>

        <section className={styles.subsection}>

            {availableOrders.map(availableOrder => (
                <button className={availableOrder.buttonStyles.join(" ")}
                    key={"order-" + availableOrder.orderType.name}
                    title={availableOrder.orderType.name}
                    onClick={availableOrder.onClickFunction}>
                    {availableOrder.orderType.letterCode}
                </button>
            ))}
        </section>

    </nav>
}