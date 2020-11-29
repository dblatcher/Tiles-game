import styles from "./citizenRow.module.scss";

export default function CitizenRow(props) {
    const { town, handleCitizenClick } = props
    const { population, adjustedUnhappiness } = town

    let bunchUp = 0 // fits 10
    if (population > 10) {
        bunchUp = 2.4 + ((population - 10) * 0.3)
    }
    if (population > 20) {
        bunchUp = 5.4 + ((population - 20) * 0.2)
    }
    if (population > 30) {
        bunchUp = 7.4 + ((population - 30) * 0.05)
    }


    return (
        <article className={styles.citizenRow}>
            {town.citizens.map((citizen, index) => {

                const classList = [styles.citizenFigure]
                if (index + 1 > population - adjustedUnhappiness) { classList.push(styles.unhappy) }

                const styleObject = Object.assign({
                    marginLeft: index === 0
                        ? 0
                        : `-${bunchUp}%`,
                    fontSize: '100%',
                }, citizen.job.spriteStyle)

                return (
                    <i key={`citizen-${index}`}
                        onClick={ handleCitizenClick ? () => handleCitizenClick(citizen) : null}
                        className={classList.join(" ")}
                        style={styleObject}
                    />
                )
            })}
        </article>
    )
}