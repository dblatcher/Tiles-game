import { onGoingOrderTypes } from '../lib/OngoingOrder.tsx'

import styles from './orderButtons.module.scss'

export default function OrderButtons(props) {
    const { selectedUnit, handleOrderButton, squareSelectedUnitIsIn, unitContextMenu } = props;

    const availableOrders = selectedUnit
        ? onGoingOrderTypes
            .filter(orderType => selectedUnit.type[orderType.requiredUnitSkill] > 0)
            .map(orderType => {

                const isDisabled = !orderType.checkIsValidForSquare(squareSelectedUnitIsIn)
                const isOnGoing = selectedUnit.onGoingOrder && selectedUnit.onGoingOrder.type == orderType
                let buttonStyles = [styles.button]
                let onClickFunction;

                if (isOnGoing) {
                    buttonStyles.push(styles.cancel)
                    onClickFunction = () => { handleOrderButton('CANCEL_ORDER') }
                }
                else if (isDisabled) {
                    buttonStyles.push(styles.disabled)
                }
                else {
                    onClickFunction = () => { handleOrderButton('START_ORDER', { orderType, unit: selectedUnit }) }
                }

                return { orderType, buttonStyles, isDisabled, isOnGoing, onClickFunction }
            })
        : [];

    const holdButtonIsDisabled = selectedUnit && (selectedUnit.onGoingOrder || selectedUnit.remainingMoves) === 0
    const holdButtonStyles = holdButtonIsDisabled
        ? [styles.button, styles.disabled]
        : [styles.button];
    const holdButtonFunction = holdButtonIsDisabled
        ? null
        : () => { handleOrderButton('HOLD_UNIT') }

    return <section className={unitContextMenu ? {} : styles.section}>

        <section className={styles.subsection}>

            {selectedUnit ? (
                <button
                    className={holdButtonStyles.join(" ")}
                    title={`hold unit`}
                    onClick={holdButtonFunction}>
                    H
                </button>
            ) : (null)}
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