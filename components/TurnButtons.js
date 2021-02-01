
import styles from './turnButtons.module.scss'

export default function TurnButtons(props) {
    const { handleOrderButton, allUnitsMoved } = props;

    const endOfTurnButtonClassList = [styles.button, styles.endButton]
    if (allUnitsMoved) {
        endOfTurnButtonClassList.push(styles.highlight)
    }

    return (
        <section className={styles.turnButtonsMenu}>
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
                className={endOfTurnButtonClassList.join(" ")}
                title={`End of turn`}
                onClick={() => { handleOrderButton('END_OF_TURN') }}>
                end turn
            </button>
        </section>
    )
}