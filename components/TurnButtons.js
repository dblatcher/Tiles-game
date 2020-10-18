
import styles from './orderButtons.module.scss'

export default function TurnButtons(props) {
    const { handleOrderButton } = props;


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
                className={[styles.button, styles.endButton].join(" ")}
                title={`End of turn`}
                onClick={() => { handleOrderButton('END_OF_TURN') }}>
                end
            </button>
        </section>
    )
}