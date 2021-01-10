import styles from "./window.module.scss";

export default function Window(props) {

    const { title, buttons = [], subtitle = "" } = props

    return (
        <main className={styles.window}>

            <header className={styles.header}>
                <div>
                    <h1>{title}</h1>
                    {!!subtitle && (
                        <p>
                            <em>{subtitle}</em>
                        </p>
                    )}
                </div>
                <nav className={styles.buttonHolder}>
                    {buttons.map((button, index) => {
                        return <button key={`window-header-button-${button.text}`}
                            className={styles.button}
                            onClick={button.clickFunction}>
                            {button.text}
                        </button>
                    })}
                </nav>
            </header>
            {props.children}
        </main>
    )
}