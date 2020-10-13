import { onGoingOrderTypes } from '../lib/OngoingOrder.tsx'

import styles from './orderButtons.module.scss'

export default function OrderButtons(props) {
    const { selectedUnit, handleInterfaceButton, squareSelectedUnitIsIn } = props;

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
                    onClickFunction = () => {
                        handleInterfaceButton('CANCEL_ORDER', { orderType, unit: selectedUnit })
                    }
                }
                else if (isDisabled) {
                    buttonStyles.push(styles.disabled)
                }
                else {
                    onClickFunction = () => {
                        handleInterfaceButton('START_ORDER', { orderType, unit: selectedUnit })
                    }
                }

                return { orderType, buttonStyles, isDisabled, isOnGoing, onClickFunction }
            })
        : [];

    const holdButtonIsDisabled = selectedUnit.onGoingOrder
    const holdButtonStyles  = holdButtonIsDisabled 
    ? [styles.button, styles.disabled] 
    : [styles.button];
    const holdButtonFunction = holdButtonIsDisabled
        ? null
        : () => { handleInterfaceButton('HOLD_UNIT') }

    return <section className={styles.section}>

        <section className={styles.subsection}>

            <button
                className={holdButtonStyles.join(" ")}
                title={`hold unit`}
                onClick={holdButtonFunction}>
                H
            </button>
            {availableOrders.map(availableOrder => (
                <button className={availableOrder.buttonStyles.join(" ")}
                    key={"order-" + availableOrder.orderType.name}
                    title={availableOrder.orderType.name}
                    onClick={availableOrder.onClickFunction}>
                    {availableOrder.orderType.letterCode}
                </button>
            ))}
        </section>

        <section className={styles.subsection}>
            <button
                className={styles.button}
                title={`previous unit`}
                onClick={() => { handleInterfaceButton('PREVIOUS_UNIT') }}>
                &lt;
            </button>

            <button
                className={styles.button}
                title={`Next unit`}
                onClick={() => { handleInterfaceButton('NEXT_UNIT') }}>
                &gt;
            </button>

            <button
                className={[styles.button, styles.endButton].join(" ")}
                title={`End of turn`}
                onClick={() => { handleInterfaceButton('END_OF_TURN') }}>
                end
            </button>
        </section>
    </section>
}