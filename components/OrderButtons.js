import { onGoingOrderTypes } from '../lib/OngoingOrder.tsx'

export default function OrderButtons(props) {
    const { selectedUnit, handleInterfaceButton, squareSelectedUnitIsIn } = props;

    const availableOrders = selectedUnit && !selectedUnit.onGoingOrder
        ? onGoingOrderTypes.filter(orderType => selectedUnit.type[orderType.requiredUnitSkill] > 0 && orderType.checkIsValidForSquare(squareSelectedUnitIsIn))
        : [];

    return <section>
        {availableOrders.map(orderType => (
            <button key={"order-" + orderType.name}
                onClick={() => {
                    handleInterfaceButton('START_ORDER', {
                        orderType: orderType,
                        unit: selectedUnit
                    })
                }}>
                {orderType.name}
            </button>
        ))
        }
        <button onClick={() => { handleInterfaceButton('END_OF_TURN') }}>End of turn</button>
    </section>
}