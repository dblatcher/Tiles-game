import { onGoingOrderTypes } from '../lib/OngoingOrder.tsx'

import styles from './orderButtons.module.scss'

export default function OrderButtons(props) {
    const { selectedUnit, handleOrderButton, squareSelectedUnitIsIn, unitContextMenu } = props;

    const availableOrders = selectedUnit
        ? onGoingOrderTypes
            .filter(orderType => orderType.canUnitUse(selectedUnit))
            .map(orderType => {

                const isDisabled = !orderType.checkIsValidForSquare(squareSelectedUnitIsIn) || selectedUnit.remainingMoves === 0
                const isOnGoing = selectedUnit.onGoingOrder && selectedUnit.onGoingOrder.type == orderType
                let buttonStyles = [styles.button]
                let onClickFunction;

                if (isOnGoing) {
                    buttonStyles.push(styles.cancel)
                    onClickFunction = () => { handleOrderButton('CANCEL_ORDER') }
                }
                else if (isDisabled) {
                    buttonStyles.push(styles.buttonDisabled)
                }
                else {
                    onClickFunction = () => { handleOrderButton('START_ORDER', { orderType, unit: selectedUnit }) }
                }

                return { orderType, buttonStyles, isDisabled, isOnGoing, onClickFunction }
            })
        : [];

    return <section className={unitContextMenu ? {} : styles.section}>

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

        {!unitContextMenu ? (
            <section className={styles.subsection}>
                <button
                    className={styles.button}
                    title={`previous unit`}
                    onClick={() => { handleOrderButton('PREVIOUS_UNIT') }}>
                    &lt;
                </button>

                <button
                    className={styles.button}
                    title={`Next unit`}
                    onClick={() => { handleOrderButton('NEXT_UNIT') }}>
                    &gt;
                </button>

                <button
                    className={[styles.button, styles.endButton].join(" ")}
                    title={`End of turn`}
                    onClick={() => { handleOrderButton('END_OF_TURN') }}>
                    end
                </button>
            </section>
        ) : null}

    </section>
}